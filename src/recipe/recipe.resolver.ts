import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { Recipe } from './recipe.entity';
import { RecipeDTO } from './recipe.dto';
import { GastronomicCulture } from '../gastronomic-culture/gastronomic-culture.entity';
import { RecipeService } from './recipe.service';

@Resolver()
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => [Recipe])
  recipes(): Promise<RecipeDTO[]> {
    return this.recipeService.findAll();
  }

  @Query(() => Recipe)
  recipe(@Args('id') id: string): Promise<Recipe> {
    return this.recipeService.findOne(id);
  }

  @Mutation(() => Recipe)
  createRecipe(@Args('recipe') recipeDto: RecipeDTO): Promise<Recipe> {
    const recipe = plainToInstance(Recipe, recipeDto);
    return this.recipeService.create(recipe);
  }

  @Mutation(() => Recipe)
  updateRecipe(
    @Args('id') id: string,
    @Args('recipe') recipeDto: RecipeDTO,
  ): Promise<RecipeDTO> {
    const recipe = plainToInstance(Recipe, recipeDto);
    return this.recipeService.update(id, recipe);
  }

  @Mutation(() => String)
  deleteCity(@Args('id') id: string) {
    this.recipeService.delete(id);
    return id;
  }

  @Mutation(() => Recipe)
  addRecipeToGastronomicCulture(
    @Args('gastronomicCultureId') id: string,
    @Args('recipe') recipeDto: RecipeDTO,
  ): Promise<GastronomicCulture> {
    const recipe = plainToInstance(Recipe, recipeDto);
    return this.recipeService.addRecipeToGastronomicCulture(id, recipe);
  }
}
