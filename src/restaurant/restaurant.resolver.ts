import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { Restaurant } from './restaurant.entity';
import { RestaurantDTO } from './restaurant.dto';
import { RestaurantService } from './restaurant.service';

@Resolver()
export class RestaurantResolver {
  constructor(private restaurantService: RestaurantService) {}

  @Query(() => [Restaurant])
  restaurants(): Promise<RestaurantDTO[]> {
    return this.restaurantService.findAll();
  }

  @Query(() => Restaurant)
  restaurant(@Args('id') id: string): Promise<Restaurant> {
    return this.restaurantService.findOne(id);
  }

  @Mutation(() => Restaurant)
  createRestaurant(
    @Args('restaurant') restaurantDto: RestaurantDTO,
  ): Promise<Restaurant> {
    const restaurant = plainToInstance(Restaurant, restaurantDto);
    return this.restaurantService.create(restaurant);
  }

  @Mutation(() => Restaurant)
  updateRestaurant(
    @Args('id') id: string,
    @Args('restaurant') restaurantDto: RestaurantDTO,
  ): Promise<RestaurantDTO> {
    const restaurant = plainToInstance(Restaurant, restaurantDto);
    return this.restaurantService.update(id, restaurant);
  }

  @Mutation(() => String)
  deleteRestaurant(@Args('id') id: string) {
    this.restaurantService.delete(id);
    return id;
  }
}
