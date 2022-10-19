/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../product/product.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/category.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CategoryProductService } from './category-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CategoryProductService', () => {
  let service: CategoryProductService;
  let categoryRepository: Repository<Category>;
  let productRepository: Repository<Product>;
  let category: Category;
  let productsList: Product[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoryProductService],
    }).compile();

    service = module.get<CategoryProductService>(CategoryProductService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productRepository.clear();
    categoryRepository.clear();

    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: Product = await productRepository.save({
        name: faker.word.adjective(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
      });
      productsList.push(product);
    }

    category = await categoryRepository.save({
      name: faker.word.adjective(),
      products: productsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('associateProductCategory should add an product to a category', async () => {
    const newProduct: Product = await productRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    const newCategory: Category = await categoryRepository.save({
      name: faker.word.adjective(),
    });

    const result: Category = await service.associateProductCategory(
      newCategory.id,
      newProduct.id,
    );

    expect(result.products.length).toBe(1);
    expect(result.products[0]).not.toBeNull();
    expect(result.products[0].name).toBe(newProduct.name);
    expect(result.products[0].description).toBe(newProduct.description);
    expect(result.products[0].history).toBe(newProduct.history);
  });

  it('associateProductCategory should thrown exception for an invalid product', async () => {
    const newCategory: Category = await categoryRepository.save({
      name: faker.word.adjective(),
    });

    await expect(() =>
      service.associateProductCategory(newCategory.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });

  it('disassociateProductCategory should add an product to a category', async () => {
    const newProduct: Product = await productRepository.save({
      name: faker.word.adjective(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
    });

    const newCategory: Category = await categoryRepository.save({
      name: faker.word.adjective(),
    });

    const result: Category = await service.disassociateProductCategory(
      newCategory.id,
      newProduct.id,
    );

    expect(result.products.length).toBe(0);
  });

  it('disassociateProductCategory should thrown exception for an invalid product', async () => {
    const newCategory: Category = await categoryRepository.save({
      name: faker.word.adjective(),
    });

    await expect(() =>
      service.associateProductCategory(newCategory.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The product with the given id was not found',
    );
  });
});
