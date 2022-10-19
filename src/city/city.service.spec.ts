import { Test, TestingModule } from '@nestjs/testing';
import { CityService } from './city.service';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CityDTO } from './city.dto';
import { Country } from '../country/country.entity';
import { CacheModule } from '@nestjs/common';

describe('CityService', () => {
  let service: CityService;
  let cityRepository: Repository<City>;
  let country: Country;
  let countryRepository: Repository<Country>;
  let cityList: City[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
    countryRepository = module.get<Repository<Country>>(
      getRepositoryToken(Country),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    cityRepository.clear();
    countryRepository.clear();
    cityList = [];
    for (let i = 0; i < 5; i++) {
      const city = new City();
      city.name = faker.word.adjective();
      await cityRepository.save(city);
      cityList.push(city);
    }

    country = await countryRepository.save({
      name: faker.word.adjective(),
      cities: cityList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const cities: CityDTO[] = await service.findAll();
    expect(cities).not.toBeNull();
    expect(cities).toHaveLength(cityList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCity: City = cityList[0];
    const city: CityDTO = await service.findOne(storedCity.id);
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The City with the given id was not found',
    );
  });

  it('create should return a new city', async () => {
    const city: City = {
      id: '',
      name: faker.word.adjective(),
      country: null,
      restaurants: [],
    };

    const newCity: City = (await service.create(city)) as City;
    expect(newCity).not.toBeNull();

    const storedCity: CityDTO = await cityRepository.findOne({
      where: { id: newCity.id },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(newCity.name);
  });

  it('update should modify a city', async () => {
    const city: City = cityList[0];
    city.name = 'New name';
    const updatedCity: CityDTO = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();
    const storedCity: City = await cityRepository.findOne({
      where: { id: city.id },
    });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(city.name);
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: City = cityList[0];
    city = {
      ...city,
      name: 'New name',
    };
    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      'The City with the given id was not found',
    );
  });

  it('delete should remove a city', async () => {
    const city: City = cityList[0];
    await service.delete(city.id);
    const deletedCity: City = await cityRepository.findOne({
      where: { id: city.id },
    });
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const city: City = cityList[0];
    await service.delete(city.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The City with the given id was not found',
    );
  });

  it('addCityToCountry should add an city to a country', async () => {
    const newCity = await cityRepository.save({
      name: faker.word.adjective(),
    });

    const newCountry = await countryRepository.save({
      name: faker.word.adjective(),
    });

    const result = await service.addCityCountry(newCountry.id, newCity);
    expect(result.cities.length).toBe(1);
    expect(result.cities[0]).not.toBeNull();
    expect(result.cities[0].name).toBe(newCity.name);
  });

  it('addCityToContry should thrown exception for an invalid Country', async () => {
    const newCity = await cityRepository.save({
      name: faker.word.adjective(),
    });

    await expect(() =>
      service.addCityCountry('0', newCity),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findCityByCountryId should return city by country', async () => {
    const storedCity: City = cityList[0];
    const city: CityDTO = await service.findCityByCountryId(
      country.id,
      storedCity.id,
    );
    expect(city).not.toBeNull();
    expect(city.name).toEqual(storedCity.name);
  });

  it('findCityByCountryId should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findCityByCountryId(country.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findCityByCountryId should throw an exception for an invalid country', async () => {
    const city = cityList[0];
    await expect(() =>
      service.findCityByCountryId('0', city.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findCityByCountryId should throw an exception for an city not associated to the country', async () => {
    const newCity = await cityRepository.save({
      name: faker.word.adjective(),
    });

    await expect(() =>
      service.findCityByCountryId(country.id, newCity.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id is not associated to the Country',
    );
  });

  it('findAllCitiesByCountry should successfull', async () => {
    const cities: CityDTO[] = await service.findAllCitiesByCountry(country.id);
    expect(cities.length).toBe(5);
  });

  it('findAllCitiesByCountry should throw an exception for an invalid country', async () => {
    await expect(() =>
      service.findAllCitiesByCountry('0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deleteCityByCountry should remove a city from a country', async () => {
    const city = cityList[0];

    await service.deleteCityByCountry(country.id, city.id);

    const storedCountry = await countryRepository.findOne({
      where: { id: country.id },
      relations: ['cities'],
    });
    const deletedCity = storedCountry.cities.find((a) => a.id === city.id);

    expect(deletedCity).toBeUndefined();
  });

  it('deleteCityByCountry should thrown an exception for an invalid city', async () => {
    await expect(() =>
      service.deleteCityByCountry(country.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('deleteCityByCountry should thrown an exception for an invalid country', async () => {
    const city = cityList[0];
    await expect(() =>
      service.deleteCityByCountry('0', city.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deleteCityByCountry should thrown an exception for an non asocciated city', async () => {
    const newCity = await cityRepository.save({
      name: faker.word.adjective(),
    });

    await expect(() =>
      service.deleteCityByCountry(country.id, newCity.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id is not associated to the country',
    );
  });
});
