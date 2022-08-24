import { Test, TestingModule } from '@nestjs/testing';
import { WordSchema } from '../schemas/word.schema';
import { WordService } from './word.service';

describe('WordService', () => {
  let service: WordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WordService,
          useValue: {
            WordModel: WordSchema
          }
        }
      ]
    }).compile();

    service = module.get<WordService>(WordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
