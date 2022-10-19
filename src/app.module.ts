import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Category } from './category/category.entity';
import { CategoryModule } from './category/category.module';
import { Product } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { GastronomicCultureModule } from './gastronomic-culture/gastronomic-culture.module';
import { RecipeModule } from './recipe/recipe.module';
import { CountryModule } from './country/country.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { Country } from './country/country.entity';
import { Recipe } from './recipe/recipe.entity';
import { GastronomicCulture } from './gastronomic-culture/gastronomic-culture.entity';
import { Restaurant } from './restaurant/restaurant.entity';
import { City } from './city/city.entity';
import { CityModule } from './city/city.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryProductModule } from './category-product/category-product.module';
import { CityRestaurantModule } from './city-restaurant/city-restaurant.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CategoryModule,
    CategoryProductModule,
    ProductModule,
    CountryModule,
    CityModule,
    RecipeModule,
    GastronomicCultureModule,
    RestaurantModule,
    CityRestaurantModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'postgres',
      entities: [
        Category,
        Product,
        Country,
        City,
        Recipe,
        GastronomicCulture,
        Restaurant,
      ],
      dropSchema: false,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CityRestaurantModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
