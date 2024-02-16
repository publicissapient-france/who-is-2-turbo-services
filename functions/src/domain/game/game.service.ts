import { Inject, Injectable } from '@nestjs/common';
import { GameApi } from '../GameApi';
import { SeriesGame } from '../model/SeriesGame';
import { SeriesScore } from '../model/SeriesScore';
import { GameRepositorySpi } from '../GameRepositorySpi';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { shuffle } from 'lodash';
import { GameResult, Member, MemberWithPicture } from '../model/Member';
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
    gameType: GameType,
    nbPropositionsByQuestion = 4,
  ): Promise<SeriesGame> {
    const allMembersWithPictures = await this.memberRepositorySpi.getAllWithPicture();

    let membersToFind: MemberWithPicture[];
    let size;

    switch (gameType) {
      case GameType.ALL:
        membersToFind = allMembersWithPictures;
        size = allMembersWithPictures.length;
        break;
      case GameType.STRATEGY:
      case GameType.PRODUCT:
      case GameType.ENGINEERING:
      case GameType.EXPERIENCE:
      case GameType.DATA:
      case GameType.FINANCE:
        membersToFind = allMembersWithPictures.filter(
          (member) => member.capability === gameType.toString(),
        );
        break;
      case GameType.SERIES_5:
        size = 5;
        membersToFind = allMembersWithPictures;
        break;
      case GameType.SERIES_20:
        size = 20;
        membersToFind = allMembersWithPictures;
        break;
    }

    const questions = await Promise.all(
      shuffle(membersToFind)
        .slice(0, size)
        .map((selectedMember) =>
          this.generateQuestion(membersToFind, selectedMember, nbPropositionsByQuestion),
        ),
    );

    const session = await this.gameRepositorySpi.saveSeries({
      solutions: questions.map((value) => value.solution),
      gameType: gameType,
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
    const gameType = game.gameType;
    console.log('validateSeriesGame');
    console.log(game);
    console.log(game.gameType);
    if (isUndefined(gameType) || isUndefined(game.createdAt) || isUndefined(game.readAt)) {
      throw new GameTypeException();
    }
    const gameCorrectAnswers = game.solutions.filter(
      (solution, index) => solution === answers[index],
    ).length;
    const gameDuration = game.readAt.getTime() - game.createdAt.getTime();

    const currentScore = { count: gameCorrectAnswers, time: gameDuration };
    const currentRank = await this.memberRepositorySpi.getRank(currentScore, gameType);
    const memberBestScore = await this.memberRepositorySpi.getMemberScore(email, gameType);
    const isCurrentScoreBetter =
      memberBestScore !== undefined && isScoreBetter(currentScore, memberBestScore);
    if (isUndefined(memberBestScore) || isCurrentScoreBetter) {
      this.memberRepositorySpi.updateMemberScore(email, currentScore, gameType);
    }

    const baseSeriesScore = { solutions: game.solutions, score: currentScore, rank: currentRank };
    if (isUndefined(memberBestScore)) {
      return baseSeriesScore;
    } else if (isCurrentScoreBetter) {
      return { ...baseSeriesScore, bestScore: currentScore, bestRank: currentRank };
    } else {
      const memberBestRank = await this.memberRepositorySpi.getRank(memberBestScore, gameType);
      return { ...baseSeriesScore, bestScore: memberBestScore, bestRank: memberBestRank };
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

    const questionImageUrl = `/members/pictures/${selectedMember.pictureGame}`;

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

export const isScoreBetter = (gameResult: GameResult, otherGameResult: GameResult) => {
  const hasBetterCount = gameResult.count > otherGameResult.count;
  const hasSameCountButBetterTime =
    gameResult.count === otherGameResult.count && gameResult.time < otherGameResult.time;
  return hasBetterCount || hasSameCountButBetterTime;
};

export class GameTypeException {
  readonly message: string;
  readonly code: string;

  constructor() {
    this.message = 'PRECONDITION FAILED';
    this.code = 'PRECONDITION_FAILED';
  }
}
