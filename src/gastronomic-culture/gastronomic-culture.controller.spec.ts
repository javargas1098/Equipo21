import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { GastronomicCultureController } from './gastronomic-culture.controller';
import { GastronomicCultureService } from './gastronomic-culture.service';

jest.mock('./gastronomic-culture.service');

describe('GastronomicCultureController', () => {
  let controller: GastronomicCultureController;
  let spyService: GastronomicCultureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [GastronomicCultureController],
      providers: [GastronomicCultureService],
    }).compile();

    controller = module.get<GastronomicCultureController>(
      GastronomicCultureController,
    );
    spyService = module.get<GastronomicCultureService>(
      GastronomicCultureService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling findOne method', () => {
    controller.findOne('1');
    expect(spyService.findOne).toHaveBeenCalled();
  });

  it('calling create method', () => {
    const mockGastronCulture = {
      id: faker.random.alphaNumeric(),
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      recipes: [],
      restaurants: [],
      countries: [],
    };
    controller.create(mockGastronCulture);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling update method', () => {
    const gcId = faker.random.alphaNumeric();
    const mockGastronCulture = {
      id: gcId,
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      recipes: [],
      restaurants: [],
      countries: [],
    };
    controller.update(gcId, mockGastronCulture);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling delete method', () => {
    controller.delete('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
