import { Test, TestingModule } from '@nestjs/testing';
import { UserseService } from './userse.service';

describe('UserseService', () => {
  let service: UserseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserseService],
    }).compile();

    service = module.get<UserseService>(UserseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
