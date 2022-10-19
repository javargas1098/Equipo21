import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CategoryProductController } from './category-product.controller';
import { CategoryProductService } from './category-product.service';

jest.mock('./category-product.service');

describe('CategoryProductController', () => {
  let controller: CategoryProductController;
  let spyService: CategoryProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [CategoryProductController],
      providers: [CategoryProductService],
    }).compile();

    controller = module.get<CategoryProductController>(
      CategoryProductController,
    );
    spyService = module.get<CategoryProductService>(CategoryProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call method addProductCategory', () => {
    controller.addProductCategory('1', '1');
    expect(spyService.associateProductCategory).toHaveBeenCalled();
  });

  it('should call method removeProductCategory', () => {
    controller.removeProductCategory('1', '1');
    expect(spyService.disassociateProductCategory).toHaveBeenCalled();
  });
});
