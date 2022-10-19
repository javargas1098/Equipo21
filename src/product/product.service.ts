import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { ProductDTO } from './product.dto';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductService {
  cacheKey: string = 'product';
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ProductDTO[]> {
    const cached: ProductDTO[] = await this.cacheManager.get(this.cacheKey);
    if (!cached) {
      const product: ProductDTO[] = await this.productRepository.find({
        loadRelationIds: true,
      });
      await this.cacheManager.set(this.cacheKey, product);
      return product;
    }

    return cached;
  }

  async findOne(id: string): Promise<ProductDTO> {
    const product = await this.productRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!product)
      throw new BusinessLogicException(
        'The Product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return product;
  }

  async create(productDTO: ProductDTO): Promise<ProductDTO> {
    const product = new Product();
    product.name = productDTO.name;
    product.description = productDTO.description;
    product.history = productDTO.history;
    return await this.productRepository.save(product);
  }

  async update(id: string, productDTO: ProductDTO): Promise<ProductDTO> {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BusinessLogicException(
        'The Product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    product.name = productDTO.name;
    product.description = productDTO.description;
    product.history = productDTO.history;
    await this.productRepository.save(product);
    return product;
  }

  async delete(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
    });
    if (!product)
      throw new BusinessLogicException(
        'The Product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.productRepository.remove(product);
  }
}
