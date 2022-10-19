import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../../country/country.entity';
import { GastronomicCulture } from '../../gastronomic-culture/gastronomic-culture.entity';
import { Recipe } from '../../recipe/recipe.entity';
import { Restaurant } from '../../restaurant/restaurant.entity';
import { Category } from '../../category/category.entity';
import { Product } from '../../product/product.entity';
import { City } from '../../city/city.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      Category,
      Product,
      Country,
      City,
      Recipe,
      GastronomicCulture,
      Restaurant,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    Category,
    Product,
    Country,
    City,
    Recipe,
    GastronomicCulture,
    Restaurant,
  ]),
];
