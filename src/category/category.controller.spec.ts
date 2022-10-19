import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

jest.mock('./category.service');

describe('CategoryController', () => {
  let controller: CategoryController;
  let spyService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [CategoryController],
      providers: [CategoryService],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    spyService = module.get<CategoryService>(CategoryService);
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
    const mockCategory = {
      id: faker.random.alphaNumeric(),
      name: faker.word.adjective(),
      products: [],
    };
    controller.create(mockCategory);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling update method', () => {
    const categoryId = faker.random.alphaNumeric();
    const mockCategory = {
      id: categoryId,
      name: faker.word.adjective(),
      products: [],
    };
    controller.update(categoryId, mockCategory);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling delete method', () => {
    controller.delete('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
