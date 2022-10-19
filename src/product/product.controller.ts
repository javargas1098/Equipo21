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
import { ProductDTO } from './product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesAuthGuard } from '../auth/guards/roles-auth.guard';
import { Role } from '../shared/roles/role';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':productId')
  @Roles(Role.ADMIN, Role.USER_READER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async create(@Body() productDTO: ProductDTO) {
    const product: Product = plainToInstance(Product, productDTO);
    return await this.productService.create(product);
  }

  @Put(':productId')
  @Roles(Role.ADMIN, Role.USER_SPECIFIC, Role.USER_CREATOR)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  async update(
    @Param('productId') productId: string,
    @Body() productDTO: ProductDTO,
  ) {
    const product: Product = plainToInstance(Product, productDTO);
    return await this.productService.update(productId, product);
  }

  @Delete(':productId')
  @Roles(Role.ADMIN, Role.USER_REMOVER)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @HttpCode(204)
  async delete(@Param('productId') productId: string) {
    return await this.productService.delete(productId);
  }
}
