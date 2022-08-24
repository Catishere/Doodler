import { Test, TestingModule } from '@nestjs/testing';
import { WordController } from './word.controller';
import { WordService } from './word.service';

describe('WordController', () => {
  let controller: WordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordController],
      providers: [
        {
          provide: WordService,
          useValue: {
            WordModel: jest.fn().mockResolvedValue(() => {
              return 'yes';
            })
          }
        }
      ]
    }).compile();

    controller = module.get<WordController>(WordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
