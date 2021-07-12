import { Inject, Injectable } from '@nestjs/common';
import { GameApi } from '../GameApi';
import { SeriesGame } from '../model/SeriesGame';
import { SeriesScore } from '../model/SeriesScore';
import { GameRepositorySpi } from '../GameRepositorySpi';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { shuffle } from 'lodash';
import { Member, MemberWithPicture } from '../model/Member';
import { Question } from '../model/Question';
import { Proposition } from '../model/Proposition';
import { CryptoSpi } from '../CryptoSpi';
import { PictureStorageSpi } from '../PictureStorageSpi';
import { Readable } from 'stream';

const ONE_HOUR_IN_MS = 3600000;
const PICTURE_URL_EXPIRATION = ONE_HOUR_IN_MS;

@Injectable()
export class GameService implements GameApi {
  constructor(
    @Inject('CryptoSpi') private cryptoSpi: CryptoSpi,
    @Inject('GameRepositorySpi') private gameRepositorySpi: GameRepositorySpi,
    @Inject('MemberRepositorySpi')
    private memberRepositorySpi: MemberRepositorySpi,
    @Inject('PictureStorageSpi') private pictureStorageSpi: PictureStorageSpi,
  ) {}

  async generateSeriesGame(size: number, nbPropositionsByQuestion = 4): Promise<SeriesGame> {
    const members = await this.memberRepositorySpi.getAllWithPicture();

    const questions = await Promise.all(
      shuffle(members)
        .slice(0, size)
        .map((selectedMember) =>
          this.generateQuestion(members, selectedMember, nbPropositionsByQuestion),
        ),
    );

    const session = await this.gameRepositorySpi.saveSeries({
      solutions: questions.map((value) => value.solution),
    });

    return {
      id: session.id,
      questions: questions.map(({ question, propositions }) => {
        return {
          question,
          propositions,
        };
      }),
    };
  }

  async validateSeriesGame(gameId: string, answers: number[], email: string): Promise<SeriesScore> {
    const game = await this.gameRepositorySpi.fetchSeries(gameId);
    let score = 0;
    game.solutions.forEach((answer, index) => {
      if (answer == answers[index]) {
        score++;
      }
    });
    const memberCurrentScore = await this.memberRepositorySpi.getMemberScore(email);
    if (memberCurrentScore != undefined && memberCurrentScore < score) {
      this.memberRepositorySpi.updateMemberScore(email, score);
    }

    return {
      correct: score,
      total: game.solutions.length,
    };
  }

  private async generateQuestion(
    allMember: Member[],
    selectedMember: MemberWithPicture,
    nbPropositionsByQuestion: number,
  ): Promise<Question & { solution: number }> {
    const otherMembers = shuffle(
      allMember.filter(
        (value) => value.id != selectedMember.id && value.gender === selectedMember.gender,
      ),
    ).slice(0, nbPropositionsByQuestion - 1);

    const correctProposition = GameService.mapMemberToProposition(selectedMember);
    const propositions = shuffle([
      correctProposition,
      ...otherMembers.map(GameService.mapMemberToProposition),
    ]);

    const questionImageUrl = this.cryptoSpi.cypher(`${selectedMember.picture}|${Date.now()}`);

    return {
      question: questionImageUrl,
      solution: propositions.indexOf(correctProposition),
      propositions,
    };
  }

  private static mapMemberToProposition({ firstName, lastName }: Member): Proposition {
    return { firstName, lastName };
  }

  readPicture(cypheredPictureRef: string): Promise<Readable> {
    const [picture, release] = this.cryptoSpi.decipher(cypheredPictureRef).split('|');
    const releaseDate = Number.parseInt(release);
    if (Date.now() - PICTURE_URL_EXPIRATION > releaseDate) return Promise.reject('Game expired');
    return this.pictureStorageSpi.readPicture(picture);
  }
}
