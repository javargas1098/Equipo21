import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RestaurantDTO } from '../restaurant/restaurant.dto';
import { Restaurant } from '../restaurant/restaurant.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { CityRestaurantService } from './city-restaurant.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Role } from '../shared/roles/role';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CityRestaurantController {
  constructor(private readonly cityRestaurantService: CityRestaurantService) {}

  @Put(':cityId/restaurants')
  @Roles(Role.ADMIN, Role.USER_SPECIFIC, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async addRestaurantCity(
    @Param('cityId') cityId: string,
    @Body() restaurantDTO: RestaurantDTO[],
  ) {
    const restaurants = plainToInstance(Restaurant, restaurantDTO);
    return await this.cityRestaurantService.associateRestaurantCity(
      cityId,
      restaurants,
    );
  }
}
