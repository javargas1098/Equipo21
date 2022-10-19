import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { Recipe } from './recipe.entity';
import { GastronomicCulture } from '../gastronomic-culture/gastronomic-culture.entity';
import { RecipeDTO } from './recipe.dto';
import { RecipeService } from './recipe.service';
import { CacheModule } from '@nestjs/common';

describe('RecipeService', () => {
  let service: RecipeService;
  let recipeRepository: Repository<Recipe>;
  let gastronomicCultureRepository: Repository<GastronomicCulture>;
  let gastronomicCulture: GastronomicCulture;
  let recipeList: Recipe[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RecipeService],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    recipeRepository = module.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
    gastronomicCultureRepository = module.get<Repository<GastronomicCulture>>(
      getRepositoryToken(GastronomicCulture),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    recipeRepository.clear();
    gastronomicCultureRepository.clear();
    recipeList = [];

    for (let i = 0; i < 5; i++) {
      const recipe = new Recipe();
      recipe.name = faker.word.adjective();
      recipe.description = faker.lorem.lines();
      recipe.photo = faker.image.imageUrl();
      recipe.video = faker.image.imageUrl();
      recipe.preparationProcess = faker.lorem.lines();
      await recipeRepository.save(recipe);
      recipeList.push(recipe);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      recipes: recipeList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recipes', async () => {
    const recipe: RecipeDTO[] = await service.findAll();
    expect(recipe).not.toBeNull();
    expect(recipe).toHaveLength(recipeList.length);
  });

  it('findOne should return a recipe by id', async () => {
    const storedRecipe: Recipe = recipeList[0];
    const recipe: RecipeDTO = await service.findOne(storedRecipe.id);
    expect(recipe).not.toBeNull();
    expect(recipe.name).toEqual(storedRecipe.name);
    expect(recipe.description).toEqual(storedRecipe.description);
    expect(recipe.photo).toEqual(storedRecipe.photo);
    expect(recipe.video).toEqual(storedRecipe.video);
    expect(recipe.preparationProcess).toEqual(storedRecipe.preparationProcess);
  });

  it('findOne should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('create should return a new recipe', async () => {
    const recipe: Recipe = {
      id: '',
      name: faker.word.adjective(),
      description: faker.lorem.text(),
      photo: faker.image.imageUrl(),
      video: faker.lorem.lines(),
      preparationProcess: faker.lorem.paragraph(),
      gastronomicCulture: null,
      products: [],
    };
    const newRecipe: Recipe = await service.create(recipe);
    expect(newRecipe).not.toBeNull();

    const storedRecipe: Recipe = await recipeRepository.findOne({
      where: { id: newRecipe.id },
    });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(newRecipe.name);
    expect(storedRecipe.description).toEqual(newRecipe.description);
    expect(storedRecipe.photo).toEqual(newRecipe.photo);
    expect(storedRecipe.video).toEqual(newRecipe.video);
    expect(storedRecipe.preparationProcess).toEqual(
      newRecipe.preparationProcess,
    );
  });

  it('update should modify a recipe', async () => {
    const recipe: Recipe = recipeList[0];
    recipe.name = 'New name';
    recipe.description = 'New description';
    const updatedRecipe: RecipeDTO = await service.update(recipe.id, recipe);
    expect(updatedRecipe).not.toBeNull();
    const storedRecipe: Recipe = await recipeRepository.findOne({
      where: { id: recipe.id },
    });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(recipe.name);
    expect(storedRecipe.description).toEqual(recipe.description);
  });

  it('update should throw an exception for an invalid recipe', async () => {
    let recipe: Recipe = recipeList[0];
    recipe = {
      ...recipe,
      name: 'New name',
    };
    await expect(() => service.update('0', recipe)).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('addRecipeToGastronomicCulture should add an recipe to a gastronomic culture', async () => {
    const newRecipe = await recipeRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      photo: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparationProcess: faker.lorem.lines(),
    });

    const newGastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
    });

    const result = await service.addRecipeToGastronomicCulture(
      newGastronomicCulture.id,
      newRecipe,
    );

    expect(result.recipes.length).toBe(1);
    expect(result.recipes[0]).not.toBeNull();
    expect(result.recipes[0].name).toBe(newRecipe.name);
    expect(result.recipes[0].description).toBe(newRecipe.description);
    expect(result.recipes[0].photo).toBe(newRecipe.photo);
    expect(result.recipes[0].video).toBe(newRecipe.video);
    expect(result.recipes[0].preparationProcess).toBe(
      newRecipe.preparationProcess,
    );
  });

  it('addRecipeToGastronomicCulture should thrown exception for an invalid gastronomic Culture', async () => {
    const newRecipe = await recipeRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      photo: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparationProcess: faker.lorem.lines(),
    });

    await expect(() =>
      service.addRecipeToGastronomicCulture('0', newRecipe),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findRecipeByGastronomicCultureId should return recipe by gastronomic culture', async () => {
    const storedRecipe: Recipe = recipeList[0];
    const recipe: Recipe = await service.findRecipeByGastronomicCultureId(
      storedRecipe.id,
      gastronomicCulture.id,
    );
    expect(recipe).not.toBeNull();
    expect(recipe.name).toEqual(storedRecipe.name);
    expect(recipe.description).toEqual(storedRecipe.description);
    expect(recipe.photo).toEqual(storedRecipe.photo);
    expect(recipe.video).toEqual(storedRecipe.video);
    expect(recipe.preparationProcess).toEqual(storedRecipe.preparationProcess);
  });

  it('findRecipeByGastronomicCultureId should throw an exception for an invalid recipe', async () => {
    await expect(() =>
      service.findRecipeByGastronomicCultureId('0', gastronomicCulture.id),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('findRecipeByGastronomicCultureId should throw an exception for an invalid gastronomic culture', async () => {
    const recipe = recipeList[0];
    await expect(() =>
      service.findRecipeByGastronomicCultureId(recipe.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findRecipeByGastronomicCultureId should throw an exception for an recipe not associated to the gastronomic culture', async () => {
    const newRecipe = await recipeRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      photo: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparationProcess: faker.lorem.lines(),
    });

    await expect(() =>
      service.findRecipeByGastronomicCultureId(
        newRecipe.id,
        gastronomicCulture.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id is not associated to the gastronomicCulture',
    );
  });

  it('findRecipesByGastronomicCultureId should successfull', async () => {
    const recipes: RecipeDTO[] =
      await service.findRecipesByGastronomicCultureId(gastronomicCulture.id);
    expect(recipes.length).toBe(5);
  });

  it('findRecipesByGastronomicCultureId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findRecipesByGastronomicCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('deleteRecipeOfGastronomicCulture should remove a recipe from a gastronomic culture', async () => {
    const recipe = recipeList[0];

    await service.deleteRecipeOfGastronomicCulture(
      gastronomicCulture.id,
      recipe.id,
    );

    const storedGastronomicCulture = await gastronomicCultureRepository.findOne(
      { where: { id: gastronomicCulture.id }, relations: ['recipes'] },
    );
    const deletedRecipe = storedGastronomicCulture.recipes.find(
      (a) => a.id === recipe.id,
    );

    expect(deletedRecipe).toBeUndefined();
  });

  it('deleteRecipeOfGastronomicCulture should thrown an exception for an invalid recipe', async () => {
    await expect(() =>
      service.deleteRecipeOfGastronomicCulture(gastronomicCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('deleteRecipeOfGastronomicCulture should thrown an exception for an invalid gastronomic culture', async () => {
    const recipe = recipeList[0];
    await expect(() =>
      service.deleteRecipeOfGastronomicCulture('0', recipe.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('deleteRecipeOfGastronomicCulture should thrown an exception for an non asocciated recipe', async () => {
    const newRecipe = await recipeRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      photo: faker.image.imageUrl(),
      video: faker.image.imageUrl(),
      preparationProcess: faker.lorem.lines(),
    });

    await expect(() =>
      service.deleteRecipeOfGastronomicCulture(
        gastronomicCulture.id,
        newRecipe.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id is not associated to the gastronomic culture',
    );
  });

  it('delete should remove a recipe', async () => {
    const recipe: Recipe = recipeList[0];
    await service.delete(recipe.id);
    const deleteRecipe: Recipe = await recipeRepository.findOne({
      where: { id: recipe.id },
    });
    expect(deleteRecipe).toBeNull();
  });

  it('delete should throw an exception for an invalid recipe', async () => {
    const recipe: Recipe = recipeList[0];
    await service.delete(recipe.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });
});
