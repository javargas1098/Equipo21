import { CacheModule, Module } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';
@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  providers: [ProductService, ProductResolver],
  controllers: [ProductController],
})
export class ProductModule {}
