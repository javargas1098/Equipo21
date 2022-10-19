import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CountryDTO } from './country.dto';
import { Country } from './country.entity';
import { CountryService } from './country.service';

@Resolver()
export class CountryResolver {
  constructor(private countryService: CountryService) {}

  @Query(() => [Country])
  countries(): Promise<CountryDTO[]> {
    return this.countryService.findAll();
  }

  @Query(() => Country)
  country(@Args('id') id: string): Promise<CountryDTO> {
    return this.countryService.findOne(id);
  }

  @Mutation(() => Country)
  createCountry(@Args('country') countryDto: CountryDTO): Promise<CountryDTO> {
    const country = plainToInstance(Country, countryDto);
    return this.countryService.create(country);
  }

  @Mutation(() => Country)
  updateCountry(
    @Args('id') id: string,
    @Args('country') countryDto: CountryDTO,
  ): Promise<CountryDTO> {
    const country = plainToInstance(Country, countryDto);
    return this.countryService.update(id, country);
  }

  @Mutation(() => String)
  deleteCountry(@Args('id') id: string) {
    this.countryService.delete(id);
    return id;
  }
}
