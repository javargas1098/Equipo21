import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { CategoryDTO } from './category.dto';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Role } from '../shared/roles/role';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('categories')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':categoryId')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async findOne(@Param('categoryId') categoryId: string) {
    return await this.categoryService.findOne(categoryId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async create(@Body() categoryDTO: CategoryDTO) {
    const category: Category = plainToInstance(Category, categoryDTO);
    return await this.categoryService.create(category);
  }

  @Put(':categoryId')
  @Roles(Role.ADMIN, Role.USER_SPECIFIC, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async update(
    @Param('categoryId') categoryId: string,
    @Body() categoryDTO: CategoryDTO,
  ) {
    const category: Category = plainToInstance(Category, categoryDTO);
    return await this.categoryService.update(categoryId, category);
  }

  @Delete(':categoryId')
  @Roles(Role.ADMIN, Role.USER_REMOVER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @HttpCode(204)
  async delete(@Param('categoryId') categoryId: string) {
    return await this.categoryService.delete(categoryId);
  }
}
