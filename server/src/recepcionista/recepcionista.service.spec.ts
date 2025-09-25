import { Test, TestingModule } from '@nestjs/testing';
import { RecepcionistaService } from './recepcionista.service';

describe('RecepcionistaService', () => {
  let service: RecepcionistaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecepcionistaService],
    }).compile();

    service = module.get<RecepcionistaService>(RecepcionistaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
