import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../city/city.entity';
import { Repository } from 'typeorm';
import { Restaurant } from '../restaurant/restaurant.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CityRestaurantService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  async associateRestaurantCity(
    cityId: string,
    restaurants: Restaurant[],
  ): Promise<City> {
    const city: City = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['restaurants'],
    });

    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant: Restaurant = await this.restaurantRepository.findOne({
        where: { id: restaurants[i].id },
      });
      if (!restaurant)
        throw new BusinessLogicException(
          'The restaurant with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    city.restaurants = restaurants;
    return await this.cityRepository.save(city);
  }
}
