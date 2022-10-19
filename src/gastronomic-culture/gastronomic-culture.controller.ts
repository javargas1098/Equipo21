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
import { GastronomicCultureDTO } from './gastronomic-culture.dto';
import { GastronomicCulture } from './gastronomic-culture.entity';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Role } from '../shared/roles/role';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('gastronomic-cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class GastronomicCultureController {
  constructor(
    private readonly gastronomicCultureService: GastronomicCultureService,
  ) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async findAll() {
    return await this.gastronomicCultureService.findAll();
  }

  @Get(':gastronomicCultureId')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async findOne(@Param('gastronomicCultureId') gastronomicCultureId: string) {
    return await this.gastronomicCultureService.findOne(gastronomicCultureId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async create(@Body() gastronomicCultureDTO: GastronomicCultureDTO) {
    const gastronomicCulture: GastronomicCulture = plainToInstance(
      GastronomicCulture,
      gastronomicCultureDTO,
    );
    return await this.gastronomicCultureService.create(gastronomicCulture);
  }

  @Put(':gastronomicCultureId')
  @Roles(Role.ADMIN, Role.USER_SPECIFIC, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async update(
    @Param('gastronomicCultureId') gastronomicCultureId: string,
    @Body() gastronomicCultureDTO: GastronomicCultureDTO,
  ) {
    const gastronomicCulture: GastronomicCulture = plainToInstance(
      GastronomicCulture,
      gastronomicCultureDTO,
    );
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }

  @Delete(':gastronomicCultureId')
  @Roles(Role.ADMIN, Role.USER_REMOVER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @HttpCode(204)
  async delete(@Param('gastronomicCultureId') gastronomicCultureId: string) {
    return await this.gastronomicCultureService.delete(gastronomicCultureId);
  }
}
