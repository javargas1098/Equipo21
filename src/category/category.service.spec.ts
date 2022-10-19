import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { faker } from '@faker-js/faker';
import { CategoryDTO } from './category.dto';
import { CacheModule } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: Repository<Category>;
  let categoryList: Category[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CategoryService],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    categoryList = [];
    for (let i = 0; i < 5; i++) {
      const category = new Category();
      category.name = faker.word.adjective();
      await repository.save(category);
      categoryList.push(category);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all categories', async () => {
    const categories: CategoryDTO[] = await service.findAll();
    expect(categories).not.toBeNull();
    expect(categories).toHaveLength(categoryList.length);
  });

  it('findOne should return a category by id', async () => {
    const storedCategory: Category = categoryList[0];
    const category: CategoryDTO = await service.findOne(storedCategory.id);
    expect(category).not.toBeNull();
    expect(category.name).toEqual(storedCategory.name);
  });

  it('findOne should throw an exception for an invalid category', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('create should return a new category', async () => {
    const category: Category = {
      id: '',
      name: faker.word.adjective(),
      products: [],
    };

    const newCategory: Category = (await service.create(category)) as Category;
    expect(newCategory).not.toBeNull();
    const storedCategory: CategoryDTO = await repository.findOne({
      where: { id: newCategory.id },
    });
    expect(storedCategory).not.toBeNull();
    expect(storedCategory.name).toEqual(newCategory.name);
  });

  it('update should modify a category', async () => {
    const category: Category = categoryList[0];
    category.name = 'New name';
    const updatedCategory: CategoryDTO = await service.update(
      category.id,
      category,
    );
    expect(updatedCategory).not.toBeNull();
    const storedCategory: Category = await repository.findOne({
      where: { id: category.id },
    });
    expect(storedCategory).not.toBeNull();
    expect(storedCategory.name).toEqual(category.name);
  });

  it('update should throw an exception for an invalid category', async () => {
    let category: Category = categoryList[0];
    category = {
      ...category,
      name: 'New name',
    };
    await expect(() => service.update('0', category)).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });

  it('delete should remove a category', async () => {
    const category: Category = categoryList[0];
    await service.delete(category.id);
    const deletedCategory: Category = await repository.findOne({
      where: { id: category.id },
    });
    expect(deletedCategory).toBeNull();
  });

  it('delete should throw an exception for an invalid category', async () => {
    const category: Category = categoryList[0];
    await service.delete(category.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The category with the given id was not found',
    );
  });
});
