import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CountryDTO } from './country.dto';
import { CacheModule } from '@nestjs/common';

describe('CountryService', () => {
  let service: CountryService;
  let repository: Repository<Country>;
  let countryList: Country[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CountryService],
    }).compile();

    service = module.get<CountryService>(CountryService);
    repository = module.get<Repository<Country>>(getRepositoryToken(Country));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    countryList = [];
    for (let i = 0; i < 5; i++) {
      const country = new Country();
      country.name = faker.word.adjective();
      await repository.save(country);
      countryList.push(country);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all countries', async () => {
    const countries: CountryDTO[] = await service.findAll();
    expect(countries).not.toBeNull();
    expect(countries).toHaveLength(countryList.length);
  });

  it('findOne should return a country by id', async () => {
    const storedCountry: Country = countryList[0];
    const country: CountryDTO = await service.findOne(storedCountry.id);
    expect(country).not.toBeNull();
    expect(country.name).toEqual(storedCountry.name);
  });

  it('findOne should throw an exception for an invalid country', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The Country with the given id was not found',
    );
  });

  it('create should return a new country', async () => {
    const country: Country = {
      id: '',
      name: faker.word.adjective(),
      cities: [],
      gastronomicCulture: null,
    };

    const newCountry: Country = (await service.create(country)) as Country;
    expect(newCountry).not.toBeNull();

    const storedCountry: CountryDTO = await repository.findOne({
      where: { id: newCountry.id },
    });
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.name).toEqual(newCountry.name);
  });

  it('update should modify a country', async () => {
    const country: Country = countryList[0];
    country.name = 'New name';
    const updatedCountry: CountryDTO = await service.update(
      country.id,
      country,
    );
    expect(updatedCountry).not.toBeNull();
    const storedCountry: Country = await repository.findOne({
      where: { id: country.id },
    });
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.name).toEqual(country.name);
  });

  it('update should throw an exception for an invalid country', async () => {
    let country: Country = countryList[0];
    country = {
      ...country,
      name: 'New name',
    };
    await expect(() => service.update('0', country)).rejects.toHaveProperty(
      'message',
      'The Country with the given id was not found',
    );
  });

  it('delete should remove a country', async () => {
    const country: Country = countryList[0];
    await service.delete(country.id);
    const deletedCountry: Country = await repository.findOne({
      where: { id: country.id },
    });
    expect(deletedCountry).toBeNull();
  });

  it('delete should throw an exception for an invalid country', async () => {
    const country: Country = countryList[0];
    await service.delete(country.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The Country with the given id was not found',
    );
  });
});
