import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityRestaurantService } from './city-restaurant.service';
import { CityRestaurantController } from './city-restaurant.controller';
import { Restaurant } from '../restaurant/restaurant.entity';
import { City } from '../city/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, City])],
  providers: [CityRestaurantService],
  controllers: [CityRestaurantController],
})
export class CityRestaurantModule {}
