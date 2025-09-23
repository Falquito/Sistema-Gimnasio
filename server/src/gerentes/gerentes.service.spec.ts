import { Test, TestingModule } from '@nestjs/testing';
import { GerentesService } from './gerentes.service';

describe('GerentesService', () => {
  let service: GerentesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GerentesService],
    }).compile();

    service = module.get<GerentesService>(GerentesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
