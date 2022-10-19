import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { GastronomicCultureDTO } from './gastronomic-culture.dto';
import { GastronomicCulture } from './gastronomic-culture.entity';
import { GastronomicCultureService } from './gastronomic-culture.service';

@Resolver()
export class GastronomicCultureResolver {
  constructor(private gastronomicCultureService: GastronomicCultureService) {}

  @Query(() => [GastronomicCulture])
  countries(): Promise<GastronomicCultureDTO[]> {
    return this.gastronomicCultureService.findAll();
  }

  @Query(() => GastronomicCulture)
  gastronomicCulture(@Args('id') id: string): Promise<GastronomicCultureDTO> {
    return this.gastronomicCultureService.findOne(id);
  }

  @Mutation(() => GastronomicCulture)
  createCountry(
    @Args('gastronomicCulture') countryDto: GastronomicCultureDTO,
  ): Promise<GastronomicCultureDTO> {
    const gastronomicCulture = plainToInstance(GastronomicCulture, countryDto);
    return this.gastronomicCultureService.create(gastronomicCulture);
  }

  @Mutation(() => GastronomicCulture)
  updateCountry(
    @Args('id') id: string,
    @Args('gastronomicCulture') countryDto: GastronomicCultureDTO,
  ): Promise<GastronomicCultureDTO> {
    const gastronomicCulture = plainToInstance(GastronomicCulture, countryDto);
    return this.gastronomicCultureService.update(id, gastronomicCulture);
  }

  @Mutation(() => String)
  deleteCountry(@Args('id') id: string) {
    this.gastronomicCultureService.delete(id);
    return id;
  }
}
