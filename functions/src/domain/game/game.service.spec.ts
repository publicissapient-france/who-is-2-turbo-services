import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { GameRepositorySpi } from '../GameRepositorySpi';
import { Provider } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { Member } from '../model/Member';
import { Gender } from '../model/Gender';
import { GameType } from '../model/GameType';
import Mock = jest.Mock;

const male1: Member = {
  createdAt: new Date(),
  readAt: new Date(),
  picture: '/members/pictures/m1.png',
  pictureGame: 'm1.png',
  pictureGallery: 'm1.png',
  id: 'm1',
  lastName: 'Blague',
  firstName: 'Toto',
  firstName_unaccent: 'Toto',
  gender: Gender.MALE,
  email: 'email@male1',
};
const male2: Member = {
  createdAt: new Date(),
  readAt: new Date(),
  picture: '/members/pictures/m2.png',
  pictureGame: 'm2.png',
  pictureGallery: 'm2.png',
  id: 'm2',
  lastName: 'tutu',
  firstName: 'Lucien',
  firstName_unaccent: 'Lucien',
  gender: Gender.MALE,
  email: 'email@male2',
};
const female1: Member = {
  createdAt: new Date(),
  readAt: new Date(),
  picture: '/members/pictures/f1.png',
  pictureGame: 'f1.png',
  pictureGallery: 'f1.png',
  id: 'f1',
  lastName: 'Ranoux',
  firstName: 'Monique',
  firstName_unaccent: 'Monique',
  gender: Gender.FEMALE,
  email: 'email@female1',
};
const female2: Member = {
  createdAt: new Date(),
  readAt: new Date(),
  picture: '/members/pictures/f2.png',
  pictureGame: 'f2.png',
  pictureGallery: 'f2.png',
  id: 'f2',
  lastName: 'La Brouette',
  firstName: 'Gertrude',
  firstName_unaccent: 'Gertrude',
  gender: Gender.FEMALE,
  email: 'email@female2',
};

const findMember = (member: { firstName: string; lastName: string }) => {
  return [male1, male2, female1, female2].find(
    (value) => value.firstName === member.firstName && value.lastName && member.lastName,
  );
};

const guessMember = (pictureUrl: string) => {
  return [male1, male2, female1, female2].find((value) => value.picture === pictureUrl);
};

describe('GameService', () => {
  let service: GameService;

  const mockGameRepo: GameRepositorySpi = {
    saveSeries: jest.fn(),
    drop: jest.fn(),
    fetchSeries: jest.fn(),
    deleteGames: jest.fn(),
  };
  const gameRepo: Provider<GameRepositorySpi> = {
    provide: 'GameRepositorySpi',
    useValue: mockGameRepo,
  };

  const mockMemberRepo: MemberRepositorySpi = {
    getAllWithPicture: jest.fn(),
    loadGalleryMembers: jest.fn(),
    getMemberScore: jest.fn(),
    getRank: jest.fn(),
    updateMemberScore: jest.fn(),
    getMembersScores: jest.fn(),
    addProfile: jest.fn(),
    getMemberWithPictureByEmail: jest.fn(),
    updateProfile: jest.fn,
    deleteScores: jest.fn(),
    getMemberRole: jest.fn(),
    findUserByPictureGalleryToken: jest.fn(),
    findUserByGameGalleryToken: jest.fn(),
  };
  const memberRepo: Provider<MemberRepositorySpi> = {
    provide: 'MemberRepositorySpi',
    useValue: mockMemberRepo,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [gameRepo, memberRepo, GameService],
    }).compile();

    (mockMemberRepo.getAllWithPicture as Mock).mockImplementation(() => {
      return [male1, male2, female1, female2];
    });

    (mockGameRepo.saveSeries as Mock).mockImplementation((session) => {
      return Promise.resolve({ ...session, id: 'idGame' });
    });

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a series game', async () => {
    (mockMemberRepo.getAllWithPicture as Mock).mockImplementation(() => {
      return [male1, male2];
    });

    const game = await service.generateGameFromGameType(GameType.SERIES_5);

    console.log(JSON.stringify(game));

    expect(game.id).toBe('idGame');
    expect(game.questions.length).toBe(2);
    expect(
      game.questions.find((question) =>
        ['/members/pictures/m1.png', '/members/pictures/m2.png'].includes(question.question),
      ),
    ).toBeDefined();
    expect(game.questions[0].propositions.length).toBe(2);
  });

  it('solution should be in the propositions', async () => {
    // WHEN
    const game = await service.generateGameFromGameType(GameType.SERIES_5);

    // THEN
    const solution = guessMember(game.questions[0].question);
    expect(solution).toBeDefined();
    expect(
      game.questions[0].propositions.some(
        (proposition) =>
          proposition.firstName === solution!.firstName &&
          proposition.lastName == solution!.lastName,
      ),
    );
  });

  it('propositions should have same gender as the question', async () => {
    (mockMemberRepo.getAllWithPicture as Mock).mockImplementation(() => {
      return [male1, male2, female1, female2];
    });

    const game = await service.generateGameFromGameType(GameType.SERIES_5);

    const questionMember = guessMember(game.questions[0].question);

    expect(questionMember).toBeDefined();
    game.questions[0].propositions.forEach((proposition) => {
      expect(findMember(proposition)?.gender).toBe(questionMember?.gender);
    });
  });
});
