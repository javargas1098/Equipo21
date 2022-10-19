import {
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/interceptor';
import { CategoryProductService } from './category-product.service';
import { Roles } from '../shared/decorators/roles.decorator';
import { Role } from '../shared/roles/role';

@Controller('categories')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoryProductController {
  constructor(
    private readonly categoryProductService: CategoryProductService,
  ) {}

  @Roles(Role.ADMIN, Role.USER_SPECIFIC, Role.USER_CREATOR)
  @Post(':categoryId/products/:productId')
  async addProductCategory(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    return await this.categoryProductService.associateProductCategory(
      categoryId,
      productId,
    );
  }

  @Roles(Role.ADMIN, Role.USER_REMOVER)
  @Delete(':categoryId/products/:productId')
  async removeProductCategory(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    return await this.categoryProductService.disassociateProductCategory(
      categoryId,
      productId,
    );
  }
}
