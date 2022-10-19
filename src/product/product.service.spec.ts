import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductDTO } from './product.dto';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;
  let productList: Product[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productList = [];
    for (let i = 0; i < 5; i++) {
      const product = new Product();
      product.name = faker.word.adjective();
      product.description = faker.lorem.lines();
      product.history = faker.lorem.lines();
      await repository.save(product);
      productList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductDTO[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: Product = productList[0];
    const product: ProductDTO = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.name).toEqual(storedProduct.name);
    expect(product.description).toEqual(storedProduct.description);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The Product with the given id was not found',
    );
  });

  it('create should return a new product', async () => {
    const product: Product = {
      id: '',
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      history: faker.lorem.lines(),
      category: null,
      recipes: [],
    };

    const newProduct: Product = (await service.create(product)) as Product;
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductDTO = await repository.findOne({
      where: { id: newProduct.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name);
    expect(storedProduct.description).toEqual(newProduct.description);
  });

  it('update should modify a product', async () => {
    const product: Product = productList[0];
    product.name = 'New name';
    product.description = 'New description';
    const updatedProduct: ProductDTO = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    const storedProduct: Product = await repository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(product.name);
    expect(storedProduct.description).toEqual(product.description);
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: Product = productList[0];
    product = {
      ...product,
      name: 'New name',
    };
    await expect(() => service.update('0', product)).rejects.toHaveProperty(
      'message',
      'The Product with the given id was not found',
    );
  });

  it('delete should remove a product', async () => {
    const product: Product = productList[0];
    await service.delete(product.id);
    const deletedProduct: Product = await repository.findOne({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    const product: Product = productList[0];
    await service.delete(product.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The Product with the given id was not found',
    );
  });
});
