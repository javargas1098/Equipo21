import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './city.entity';
import { Repository } from 'typeorm';
import { CityDTO } from './city.dto';
import { Country } from '../country/country.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CityService {
  cacheKey: string = 'city';

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<CityDTO[]> {
    const cached: CityDTO[] = await this.cacheManager.get<CityDTO[]>(
      this.cacheKey,
    );
    if (!cached) {
      const cities: CityDTO[] = await this.cityRepository.find({
        loadRelationIds: true,
      });
      await this.cacheManager.set(this.cacheKey, cities);
      return cities;
    }

    return cached;
  }

  async findOne(id: string): Promise<CityDTO> {
    const city = await this.cityRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!city)
      throw new BusinessLogicException(
        'The City with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return city;
  }

  async findAllCitiesByCountry(countryId: string): Promise<CityDTO[]> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['cities'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return country.cities;
  }

  async findCityByCountryId(
    countryId: string,
    cityId: string,
  ): Promise<CityDTO> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['cities'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const city = await this.cityRepository.findOne({
      where: { id: cityId },
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const cityCountry = country.cities.find((e) => e.id === city.id);

    if (!cityCountry)
      throw new BusinessLogicException(
        'The city with the given id is not associated to the Country',
        BusinessError.PRECONDITION_FAILED,
      );
    return cityCountry;
  }

  async create(cityDTO: CityDTO): Promise<CityDTO> {
    const city = new City();
    city.name = cityDTO.name;
    return await this.cityRepository.save(city);
  }

  async addCityCountry(countryId: string, cityDTO: CityDTO): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['cities'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const city = new City();
    city.name = cityDTO.name;
    const newCity = await this.cityRepository.save(city);
    country.cities = [...country.cities, newCity];
    return await this.countryRepository.save(country);
  }

  async update(id: string, cityDTO: CityDTO): Promise<CityDTO> {
    const city = await this.cityRepository.findOne({
      where: { id },
    });
    if (!city)
      throw new BusinessLogicException(
        'The City with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    city.name = cityDTO.name;
    await this.cityRepository.save(city);
    return city;
  }

  async delete(id: string) {
    const city = await this.cityRepository.findOne({
      where: { id },
    });
    if (!city)
      throw new BusinessLogicException(
        'The City with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return await this.cityRepository.remove(city);
  }

  async deleteCityByCountry(countryId: string, cityId: string) {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['cities'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const city = await this.cityRepository.findOne({
      where: { id: cityId },
    });
    if (!city)
      throw new BusinessLogicException(
        'The city with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const countryCity = country.cities.find((e) => e.id === city.id);

    if (!countryCity)
      throw new BusinessLogicException(
        'The city with the given id is not associated to the country',
        BusinessError.PRECONDITION_FAILED,
      );
    country.cities = country.cities.filter((e) => e.id !== cityId);
    await this.countryRepository.save(country);
    return await this.cityRepository.remove(city);
  }
}
