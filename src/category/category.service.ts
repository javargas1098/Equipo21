import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CategoryDTO } from './category.dto';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  cacheKey: string = 'categories';

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<CategoryDTO[]> {
    const cached: CategoryDTO[] = await this.cacheManager.get<CategoryDTO[]>(
      this.cacheKey,
    );
    if (!cached) {
      const categories: CategoryDTO[] = await this.categoryRepository.find({
        loadRelationIds: true,
      });
      await this.cacheManager.set(this.cacheKey, categories);
      return categories;
    }

    return cached;
  }

  async findOne(id: string): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return category;
  }

  async create(categoryDTO: CategoryDTO): Promise<CategoryDTO> {
    const category = new Category();
    category.name = categoryDTO.name;
    return await this.categoryRepository.save(category);
  }

  async update(id: string, categoryDTO: CategoryDTO): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    category.name = categoryDTO.name;
    await this.categoryRepository.save(category);
    return category;
  }

  async delete(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.categoryRepository.remove(category);
  }
}
