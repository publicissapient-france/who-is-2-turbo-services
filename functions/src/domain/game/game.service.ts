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
import { GameType } from '../model/GameType';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class GameService implements GameApi {
  constructor(
    @Inject('GameRepositorySpi') private gameRepositorySpi: GameRepositorySpi,
    @Inject('MemberRepositorySpi')
    private memberRepositorySpi: MemberRepositorySpi,
  ) {}

  async generateGameFromGameType(gameType: GameType): Promise<SeriesGame> {
    if (isUndefined(gameType)) {
      throw new GameTypeException();
    }
    return await this.generateSeriesGame(gameType);
  }

  private async generateSeriesGame(
    size: number,
    nbPropositionsByQuestion = 4,
  ): Promise<SeriesGame> {
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

  async validateSeriesGame(
    gameId: string,
    answers: number[],
    email: string,
    resultDate: Date,
  ): Promise<SeriesScore> {
    const game = await this.gameRepositorySpi.fetchSeries(gameId);
    const gameType = GameType[GameType[answers.length] as keyof typeof GameType];
    let scoreCount = 0;
    game.solutions.forEach((answer, index) => {
      if (answer == answers[index]) {
        scoreCount++;
      }
    });
    if (isUndefined(gameType)) {
      throw new GameTypeException();
    }
    if (!isUndefined(game.createdAt)) {
      const diffTime = Math.abs(
        resultDate.getUTCMilliseconds() - game.createdAt.getUTCMilliseconds(),
      );
      const memberCurrentScore = await this.memberRepositorySpi.getMemberScoreByGameType(
        email,
        gameType,
      );

      const isNewScoreBetter = memberCurrentScore.count < scoreCount;
      const isNewTimeWithSameScoreBetter =
        memberCurrentScore.count === scoreCount && memberCurrentScore.time > diffTime;

      if (isNewScoreBetter && isNewTimeWithSameScoreBetter) {
        this.memberRepositorySpi.updateMemberScore(email, scoreCount, diffTime, gameType);
      }

      return {
        time: diffTime,
        correct: scoreCount,
        total: game.solutions.length,
      };
    } else {
      return {
        time: -1,
        correct: scoreCount,
        total: game.solutions.length,
      };
    }
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

    const questionImageUrl = await this.memberRepositorySpi.generatePrivatePictureUrl(
      selectedMember.picture,
    );

    return {
      question: questionImageUrl,
      solution: propositions.indexOf(correctProposition),
      propositions,
    };
  }

  private static mapMemberToProposition({ firstName, lastName }: Member): Proposition {
    return { firstName, lastName };
  }
}

export class GameTypeException {
  readonly message: string;
  readonly code: string;

  constructor() {
    this.message = 'PRECONDITION FAILED';
    this.code = 'PRECONDITION_FAILED';
  }
}
