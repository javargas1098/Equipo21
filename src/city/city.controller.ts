import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { CityDTO } from './city.dto';
import { CityService } from './city.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Role } from '../shared/roles/role';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('countries')
@UseInterceptors(BusinessErrorsInterceptor)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post(':countryId/cities')
  @Roles(Role.ADMIN, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async addCityCountry(
    @Param('countryId') countryId: string,
    @Body() cityDTO: CityDTO,
  ) {
    return await this.cityService.addCityCountry(countryId, cityDTO);
  }

  @Get(':countryId/cities/:cityId')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async getCityByCountryIdCityId(
    @Param('countryId') countryId: string,
    @Param('cityId') cityId: string,
  ) {
    return await this.cityService.findCityByCountryId(countryId, cityId);
  }

  @Get(':countryId/cities')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async geCitiesByCountryId(@Param('countryId') countryId: string) {
    return await this.cityService.findAllCitiesByCountry(countryId);
  }

  @Delete(':countryId/cities/:cityId')
  @Roles(Role.ADMIN, Role.USER_REMOVER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @HttpCode(204)
  async deleteCityToCountry(
    @Param('countryId') countryId: string,
    @Param('cityId') cityId: string,
  ) {
    return await this.cityService.deleteCityByCountry(countryId, cityId);
  }
}
