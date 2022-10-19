import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { ProductDTO } from './product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Resolver()
export class ProductResolver {
  constructor(private ProductService: ProductService) {}

  @Query(() => [Product])
  products(): Promise<ProductDTO[]> {
    return this.ProductService.findAll();
  }

  @Query(() => Product)
  product(@Args('id') id: string): Promise<ProductDTO> {
    return this.ProductService.findOne(id);
  }

  @Mutation(() => Product)
  createProduct(@Args('product') productDTO: ProductDTO): Promise<ProductDTO> {
    const product = plainToInstance(Product, productDTO);
    return this.ProductService.create(product);
  }

  @Mutation(() => Product)
  updateProduct(
    @Args('id') id: string,
    @Args('product') productDTO: ProductDTO,
  ): Promise<ProductDTO> {
    const product = plainToInstance(Product, productDTO);
    return this.ProductService.update(id, product);
  }

  @Mutation(() => String)
  deleteProduct(@Args('id') id: string) {
    this.ProductService.delete(id);
    return id;
  }
}
