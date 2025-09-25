import { Test, TestingModule } from '@nestjs/testing';
import { RecepcionistaController } from './recepcionista.controller';
import { RecepcionistaService } from './recepcionista.service';

describe('RecepcionistaController', () => {
  let controller: RecepcionistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecepcionistaController],
      providers: [RecepcionistaService],
    }).compile();

    controller = module.get<RecepcionistaController>(RecepcionistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
