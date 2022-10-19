import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';

jest.mock('./recipe.service');

describe('RecipeController', () => {
  let controller: RecipeController;
  let spyService: RecipeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [RecipeController],
      providers: [RecipeService],
    }).compile();

    controller = module.get<RecipeController>(RecipeController);
    spyService = module.get<RecipeService>(RecipeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling addRecipeGastronomicCulture method', () => {
    const recipeMock = {
      id: faker.random.alphaNumeric(),
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      photo: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparationProcess: faker.lorem.lines(),
    };
    controller.addRecipeGastronomicCulture('1', recipeMock);
    expect(spyService.addRecipeToGastronomicCulture).toHaveBeenCalled();
  });

  it('calling getRecipeByGastronomicCultureIdRecipeId method', () => {
    controller.getRecipeByGastronomicCultureIdRecipeId('1', '1');
    expect(spyService.findRecipeByGastronomicCultureId).toHaveBeenCalled();
  });

  it('calling getRecipesByGastronomicCultureId method', () => {
    controller.getRecipesByGastronomicCultureId('1');
    expect(spyService.findRecipesByGastronomicCultureId).toHaveBeenCalled();
  });

  it('calling deleteRecipeToGastronomicCulture method', () => {
    controller.deleteRecipeToGastronomicCulture('1', '1');
    expect(spyService.deleteRecipeOfGastronomicCulture).toHaveBeenCalled();
  });
});
