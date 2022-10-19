import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { CountryDTO } from './country.dto';
import { Country } from './country.entity';
import { CountryService } from './country.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Role } from '../shared/roles/role';
import { Roles } from '../shared/decorators/roles.decorator';
@Controller('countries')
@UseInterceptors(BusinessErrorsInterceptor)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async findAll() {
    return await this.countryService.findAll();
  }

  @Get(':countryId')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async findOne(@Param('countryId') countryId: string) {
    return await this.countryService.findOne(countryId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async create(@Body() countryDTO: CountryDTO) {
    const country: Country = plainToInstance(Country, countryDTO);
    return await this.countryService.create(country);
  }

  @Put(':countryId')
  @Roles(Role.ADMIN, Role.USER_SPECIFIC, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async update(
    @Param('countryId') countryId: string,
    @Body() countryDTO: CountryDTO,
  ) {
    const country: Country = plainToInstance(Country, countryDTO);
    return await this.countryService.update(countryId, country);
  }

  @Delete(':countryId')
  @Roles(Role.ADMIN, Role.USER_REMOVER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @HttpCode(204)
  async delete(@Param('countryId') countryId: string) {
    return await this.countryService.delete(countryId);
  }
}
