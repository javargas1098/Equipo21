import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProductService } from './category-product.service';
import { CategoryProductController } from './category-product.controller';
import { Product } from '../product/product.entity';
import { Category } from '../category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [CategoryProductService],
  controllers: [CategoryProductController],
})
export class CategoryProductModule {}
