import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

jest.mock('./product.service');

describe('ProductController', () => {
  let controller: ProductController;
  let spyService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [ProductController],
      providers: [ProductService],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    spyService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling findOne method', () => {
    controller.findOne('1');
    expect(spyService.findOne).toHaveBeenCalled();
  });

  it('calling create method', () => {
    const mockProduct = {
      id: faker.random.alphaNumeric(),
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      history: faker.lorem.lines(),
      category: faker.word.adjective(),
      countries: [],
    };
    controller.create(mockProduct);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling update method', () => {
    const productId = faker.random.alphaNumeric();
    const mockProduct = {
      id: faker.random.alphaNumeric(),
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      history: faker.lorem.lines(),
      category: faker.word.adjective(),
      countries: [],
    };
    controller.update(productId, mockProduct);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling delete method', () => {
    controller.delete('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
