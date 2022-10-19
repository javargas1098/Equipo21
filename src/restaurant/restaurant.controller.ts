import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { RestaurantDTO } from './restaurant.dto';
import { Restaurant } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Role } from '../shared/roles/role';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async getAllRestaurants() {
    return await this.restaurantService.findAll();
  }

  @Get(':restaurantId')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async getRestaurantById(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.findOne(restaurantId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @HttpCode(201)
  async createRestaurant(@Body() restaurantDTO: RestaurantDTO) {
    const restaurant: Restaurant = plainToInstance(Restaurant, restaurantDTO);

    return await this.restaurantService.create(restaurant);
  }

  @Put(':restaurantId')
  @Roles(Role.ADMIN, Role.USER_SPECIFIC, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async updateRestaurantById(
    @Param('restaurantId') restaurantId: string,
    @Body() restaurantDTO: RestaurantDTO,
  ) {
    const restaurant: Restaurant = plainToInstance(Restaurant, restaurantDTO);
    return await this.restaurantService.update(restaurantId, restaurant);
  }

  @Delete(':restaurantId')
  @Roles(Role.ADMIN, Role.USER_REMOVER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @HttpCode(204)
  async deleteRestaurant(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.delete(restaurantId);
  }
}
