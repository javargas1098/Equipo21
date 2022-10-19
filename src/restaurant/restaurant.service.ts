import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Restaurant } from './restaurant.entity';
import { RestaurantDTO } from './restaurant.dto';

@Injectable()
export class RestaurantService {
  cacheKey: string = 'restaurants';
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RestaurantDTO[]> {
    const cached: RestaurantDTO[] = await this.restaurantRepository.find({
      loadRelationIds: true,
    });
    if (!cached) {
      const restaurants: RestaurantDTO[] = await this.restaurantRepository.find(
        {
          loadRelationIds: true,
        },
      );
      await this.cacheManager.set(this.cacheKey, restaurants);
      return restaurants;
    }

    return cached;
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The Restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return restaurant;
  }

  async create(restaurantDTO: RestaurantDTO): Promise<Restaurant> {
    const restaurant = new Restaurant();
    restaurant.name = restaurantDTO.name;
    restaurant.date = restaurantDTO.date;
    restaurant.stars = restaurantDTO.stars;
    return await this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurantDTO: RestaurantDTO,
  ): Promise<RestaurantDTO> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The Restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    restaurant.name = restaurantDTO.name;
    restaurant.date = restaurantDTO.date;
    restaurant.stars = restaurantDTO.stars;
    await this.restaurantRepository.save(restaurant);
    return restaurant;
  }

  async delete(id: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
    });
    if (!restaurant)
      throw new BusinessLogicException(
        'The Restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.restaurantRepository.remove(restaurant);
  }
}
