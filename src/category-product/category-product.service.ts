import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/category.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class CategoryProductService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async associateProductCategory(
    categoryId: string,
    productId: string,
  ): Promise<Category> {
    const product: Product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const category: Category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });

    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    category.products = [...category.products, product];
    return await this.categoryRepository.save(category);
  }

  async disassociateProductCategory(
    categoryId: string,
    productId: string,
  ): Promise<Category> {
    const product: Product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const category: Category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });

    if (!category)
      throw new BusinessLogicException(
        'The category with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    category.products = category.products.filter(
      (product) => product.id != productId,
    );
    return await this.categoryRepository.save(category);
  }
}
