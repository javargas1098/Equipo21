import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { RecipeDTO } from './recipe.dto';
import { RecipeService } from './recipe.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Role } from '../shared/roles/role';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('gastronomic-cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post(':gastronomicCultureId/recipes')
  @Roles(Role.ADMIN, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async addRecipeGastronomicCulture(
    @Param('gastronomicCultureId') gastronomicCultureId: string,
    @Body() recipeDTO: RecipeDTO,
  ) {
    return await this.recipeService.addRecipeToGastronomicCulture(
      gastronomicCultureId,
      recipeDTO,
    );
  }

  @Get(':gastronomicCultureId/recipes/:recipeId')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async getRecipeByGastronomicCultureIdRecipeId(
    @Param('gastronomicCultureId') gastronomicCultureId: string,
    @Param('recipeId') recipeId: string,
  ) {
    return await this.recipeService.findRecipeByGastronomicCultureId(
      recipeId,
      gastronomicCultureId,
    );
  }

  @Get(':gastronomicCultureId/recipes')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async getRecipesByGastronomicCultureId(
    @Param('gastronomicCultureId') gastronomicCultureId: string,
  ) {
    return await this.recipeService.findRecipesByGastronomicCultureId(
      gastronomicCultureId,
    );
  }

  @Delete(':gastronomicCultureId/recipes/:recipeId')
  @Roles(Role.ADMIN, Role.USER_REMOVER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @HttpCode(204)
  async deleteRecipeToGastronomicCulture(
    @Param('gastronomicCultureId') gastronomicCultureId: string,
    @Param('recipeId') recipeId: string,
  ) {
    return await this.recipeService.deleteRecipeOfGastronomicCulture(
      gastronomicCultureId,
      recipeId,
    );
  }
}
