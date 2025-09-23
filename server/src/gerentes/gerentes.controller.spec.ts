import { Test, TestingModule } from '@nestjs/testing';
import { GerentesController } from './gerentes.controller';
import { GerentesService } from './gerentes.service';

describe('GerentesController', () => {
  let controller: GerentesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GerentesController],
      providers: [GerentesService],
    }).compile();

    controller = module.get<GerentesController>(GerentesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
