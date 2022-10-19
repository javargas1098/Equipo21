import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CityDTO } from './city.dto';
import { City } from './city.entity';
import { CityService } from './city.service';

@Resolver()
export class CityResolver {
  constructor(private cityService: CityService) {}

  @Query(() => [City])
  citys(): Promise<CityDTO[]> {
    return this.cityService.findAll();
  }

  @Query(() => City)
  city(@Args('id') id: string): Promise<CityDTO> {
    return this.cityService.findOne(id);
  }

  @Mutation(() => City)
  createCity(@Args('city') cityDto: CityDTO): Promise<CityDTO> {
    const city = plainToInstance(City, cityDto);
    return this.cityService.create(city);
  }

  @Mutation(() => City)
  updateCity(
    @Args('id') id: string,
    @Args('city') cityDto: CityDTO,
  ): Promise<CityDTO> {
    const city = plainToInstance(City, cityDto);
    return this.cityService.update(id, city);
  }

  @Mutation(() => String)
  deleteCity(@Args('id') id: string) {
    this.cityService.delete(id);
    return id;
  }
}
