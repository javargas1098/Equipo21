import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';
import { Recipe } from './recipe.entity';
import { RecipeDTO } from './recipe.dto';
import { GastronomicCulture } from '../gastronomic-culture/gastronomic-culture.entity';

@Injectable()
export class RecipeService {
  cacheKey: string = 'recipes';
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    @InjectRepository(GastronomicCulture)
    private readonly gastronomicCultureRepository: Repository<GastronomicCulture>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RecipeDTO[]> {
    return await this.recipeRepository.find({ loadRelationIds: true });
  }

  async findOne(recipeId: string): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
      loadRelationIds: true,
    });
    if (!recipe)
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return recipe;
  }

  async create(recipeDTO: RecipeDTO): Promise<Recipe> {
    const recipe = new Recipe();
    recipe.name = recipeDTO.name;
    recipe.description = recipeDTO.description;
    recipe.photo = recipeDTO.photo;
    recipe.video = recipeDTO.video;
    recipe.preparationProcess = recipeDTO.preparationProcess;
    return await this.recipeRepository.save(recipe);
  }

  async update(id: string, recipeDTO: RecipeDTO): Promise<RecipeDTO> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipe)
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    recipe.name = recipeDTO.name;
    recipe.description = recipeDTO.description;
    recipe.photo = recipeDTO.photo;
    recipe.video = recipeDTO.video;
    recipe.preparationProcess = recipeDTO.preparationProcess;
    await this.recipeRepository.save(recipe);
    return recipe;
  }

  async delete(id: string) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipe)
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.recipeRepository.remove(recipe);
  }

  async addRecipeToGastronomicCulture(
    gastronomicCultureId: string,
    recipeDTO: RecipeDTO,
  ): Promise<GastronomicCulture> {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: ['recipes'],
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const newRecipe = new Recipe();
    newRecipe.name = recipeDTO.name;
    newRecipe.description = recipeDTO.description;
    newRecipe.photo = recipeDTO.photo;
    newRecipe.video = recipeDTO.video;
    newRecipe.preparationProcess = recipeDTO.preparationProcess;
    const recipe = await this.recipeRepository.save(newRecipe);

    gastronomicCulture.recipes = [...gastronomicCulture.recipes, recipe];
    return await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async findRecipeByGastronomicCultureId(
    recipeId: string,
    gastronomicCultureId: string,
  ): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
      loadRelationIds: true,
    });
    if (!recipe)
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: ['recipes'],
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const recipeGastronomicCulture = gastronomicCulture.recipes.find(
      (e) => e.id === recipe.id,
    );

    if (!recipeGastronomicCulture)
      throw new BusinessLogicException(
        'The recipe with the given id is not associated to the gastronomicCulture',
        BusinessError.PRECONDITION_FAILED,
      );

    return recipeGastronomicCulture;
  }

  async findRecipesByGastronomicCultureId(
    gastronomicCultureId: string,
  ): Promise<RecipeDTO[]> {
    const cached = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: ['recipes'],
    });

    if (!cached) {
      const gastronomicCulture =
        await this.gastronomicCultureRepository.findOne({
          where: { id: gastronomicCultureId },
          relations: ['recipes'],
        });

      if (!gastronomicCulture)
        throw new BusinessLogicException(
          'The gastronomic culture with the given id was not found',
          BusinessError.NOT_FOUND,
        );

      await this.cacheManager.set(this.cacheKey, gastronomicCulture);
      return gastronomicCulture.recipes;
    }

    return cached.recipes;
  }

  async deleteRecipeOfGastronomicCulture(
    gastronomicCultureId: string,
    recipeId: string,
  ) {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });
    if (!recipe)
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id: gastronomicCultureId },
      relations: ['recipes'],
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const gastronomicCultureRecipe = gastronomicCulture.recipes.find(
      (e) => e.id === recipe.id,
    );

    if (!gastronomicCultureRecipe)
      throw new BusinessLogicException(
        'The recipe with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );

    gastronomicCulture.recipes = gastronomicCulture.recipes.filter(
      (e) => e.id !== recipeId,
    );
    await this.gastronomicCultureRepository.save(gastronomicCulture);
    await this.recipeRepository.remove(recipe);
  }
}
