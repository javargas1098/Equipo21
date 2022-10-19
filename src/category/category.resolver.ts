import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CategoryDTO } from './category.dto';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Resolver()
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [Category])
  categorys(): Promise<CategoryDTO[]> {
    return this.categoryService.findAll();
  }

  @Query(() => Category)
  category(@Args('id') id: string): Promise<CategoryDTO> {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category)
  createCategory(
    @Args('category') categoryDto: CategoryDTO,
  ): Promise<CategoryDTO> {
    const category = plainToInstance(Category, categoryDto);
    return this.categoryService.create(category);
  }

  @Mutation(() => Category)
  updateCategory(
    @Args('id') id: string,
    @Args('category') categoryDto: CategoryDTO,
  ): Promise<CategoryDTO> {
    const category = plainToInstance(Category, categoryDto);
    return this.categoryService.update(id, category);
  }

  @Mutation(() => String)
  deleteCategory(@Args('id') id: string) {
    this.categoryService.delete(id);
    return id;
  }
}
