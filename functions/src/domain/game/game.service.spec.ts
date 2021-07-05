import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { GameRepositorySpi } from '../GameRepositorySpi';
import { Provider } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { Gender, Member } from '../model/Member';
import Mock = jest.Mock;

const male1: Member = {
  createdAt: new Date(),
  picture: 'm1.png',
  id: 'm1',
  lastName: 'Blague',
  firstName: 'Toto',
  firstName_unaccent: 'Toto',
  gender: Gender.MALE,
  email: 'email@male1',
};
const male2: Member = {
  createdAt: new Date(),
  picture: 'm2.png',
  id: 'm2',
  lastName: 'tutu',
  firstName: 'Lucien',
  firstName_unaccent: 'Lucien',
  gender: Gender.MALE,
  email: 'email@male2',
};
const female1: Member = {
  createdAt: new Date(),
  picture: 'f1.png',
  id: 'f1',
  lastName: 'Ranoux',
  firstName: 'Monique',
  firstName_unaccent: 'Monique',
  gender: Gender.FEMALE,
  email: 'email@female1',
};
const female2: Member = {
  createdAt: new Date(),
  picture: 'f2.png',
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
  };
  const gameRepo: Provider<GameRepositorySpi> = {
    provide: 'GameRepositorySpi',
    useValue: mockGameRepo,
  };

  const mockMemberRepo: MemberRepositorySpi = {
    getAllWithPicture: jest.fn(),
    generatePrivatePictureUrl: jest.fn(),
    loadGalleryMembers: jest.fn(),
    getMemberScore: jest.fn(),
    updateMemberScore: jest.fn(),
    getMembersScores: jest.fn(),
    addMember: jest.fn(),
    getMemberWithPictureByEmail: jest.fn(),
    updateMember: jest.fn,
  };
  const memberRepo: Provider<MemberRepositorySpi> = {
    provide: 'MemberRepositorySpi',
    useValue: mockMemberRepo,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [gameRepo, memberRepo, GameService],
    }).compile();

    (mockMemberRepo.getAllWithPicture as Mock).mockImplementation((size: number) => {
      return [male1, male2, female1, female2];
    });

    (mockMemberRepo.generatePrivatePictureUrl as Mock).mockImplementation((picName) => {
      return Promise.resolve(picName);
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
    (mockMemberRepo.getAllWithPicture as Mock).mockImplementation((size: number) => {
      return [male1, male2];
    });

    const game = await service.generateSeriesGame(1, 2);

    console.log(JSON.stringify(game));

    expect(game.id).toBe('idGame');
    expect(game.questions.length).toBe(1);
    expect(
      game.questions.find((question) => ['m1.png', 'm2.png'].includes(question.question)),
    ).toBeDefined();
    expect(game.questions[0].propositions.length).toBe(2);
  });

  it('solution should be in the propositions', async () => {
    // WHEN
    const game = await service.generateSeriesGame(1, 2);

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
    (mockMemberRepo.getAllWithPicture as Mock).mockImplementation((size: number) => {
      return [male1, male2, female1, female2];
    });

    const game = await service.generateSeriesGame(1, 2);

    const questionMember = guessMember(game.questions[0].question);
    expect(questionMember).toBeDefined();
    game.questions[0].propositions.forEach((proposition) => {
      expect(findMember(proposition)?.gender).toBe(questionMember?.gender);
    });
  });

  it('should calculate result with defined solutions', async () => {
    (mockGameRepo.fetchSeries as Mock).mockImplementation(() => {
      return { id: 'id', solutions: [0, 2, 3] };
    });

    const scoreSession = await service.validateSeriesGame('id', [0, 2, 1], '');

    expect(scoreSession.total).toBe(3);
    expect(scoreSession.correct).toBe(2);
  });

  it('should calculate result with undefined solutions', async () => {
    (mockGameRepo.fetchSeries as Mock).mockImplementation(() => {
      return Promise.resolve({ id: 'id', solutions: [0, 1, 2] });
    });

    const scoreSession = await service.validateSeriesGame('id', [0, 2, 1], '');

    expect(scoreSession.total).toBe(3);
    expect(scoreSession.correct).toBe(1);
  });
});
