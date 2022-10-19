import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { Repository } from 'typeorm';
import { CountryDTO } from './country.dto';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CountryService {
  cacheKey: string = 'country';

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<CountryDTO[]> {
    const cached: CountryDTO[] = await this.cacheManager.get<CountryDTO[]>(
      this.cacheKey,
    );
    if (!cached) {
      const countries: CountryDTO[] = await this.countryRepository.find({
        loadRelationIds: true,
      });
      await this.cacheManager.set(this.cacheKey, countries);
      return countries;
    }

    return cached;
  }

  async findOne(id: string): Promise<CountryDTO> {
    const country = await this.countryRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!country)
      throw new BusinessLogicException(
        'The Country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return country;
  }

  async create(countryDTO: CountryDTO): Promise<CountryDTO> {
    const country = new Country();
    country.name = countryDTO.name;
    return await this.countryRepository.save(country);
  }

  async update(id: string, countryDTO: CountryDTO): Promise<CountryDTO> {
    const country = await this.countryRepository.findOne({
      where: { id },
    });
    if (!country)
      throw new BusinessLogicException(
        'The Country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    country.name = countryDTO.name;
    await this.countryRepository.save(country);
    return country;
  }

  async delete(id: string) {
    const country = await this.countryRepository.findOne({
      where: { id },
    });
    if (!country)
      throw new BusinessLogicException(
        'The Country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.countryRepository.remove(country);
  }
}
