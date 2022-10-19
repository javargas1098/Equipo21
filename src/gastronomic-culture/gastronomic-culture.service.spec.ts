import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { GastronomicCulture } from './gastronomic-culture.entity';
import { faker } from '@faker-js/faker';
import { GastronomicCultureDTO } from './gastronomic-culture.dto';
import { CacheModule } from '@nestjs/common';

describe('GastronomicCultureService', () => {
  let service: GastronomicCultureService;
  let repository: Repository<GastronomicCulture>;
  let gastronomicCultureList: GastronomicCulture[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [GastronomicCultureService],
    }).compile();

    service = module.get<GastronomicCultureService>(GastronomicCultureService);
    repository = module.get<Repository<GastronomicCulture>>(
      getRepositoryToken(GastronomicCulture),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    gastronomicCultureList = [];
    for (let i = 0; i < 5; i++) {
      const gastronomicCulture = new GastronomicCulture();
      gastronomicCulture.name = faker.word.adjective();
      gastronomicCulture.description = faker.lorem.lines();
      await repository.save(gastronomicCulture);
      gastronomicCultureList.push(gastronomicCulture);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all gastronomicCultures', async () => {
    const gastronomicCultures: GastronomicCultureDTO[] =
      await service.findAll();
    expect(gastronomicCultures).not.toBeNull();
    expect(gastronomicCultures).toHaveLength(gastronomicCultureList.length);
  });

  it('findOne should return a gastronomicCulture by id', async () => {
    const storedGastronomicCulture: GastronomicCulture =
      gastronomicCultureList[0];
    const gastronomicCulture: GastronomicCultureDTO = await service.findOne(
      storedGastronomicCulture.id,
    );
    expect(gastronomicCulture).not.toBeNull();
    expect(gastronomicCulture.name).toEqual(storedGastronomicCulture.name);
    expect(gastronomicCulture.description).toEqual(
      storedGastronomicCulture.description,
    );
  });

  it('findOne should throw an exception for an invalid gastronomicCulture', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The Gastronomic Culture with the given id was not found',
    );
  });

  it('create should return a new gastronomicCulture', async () => {
    const gastronomicCulture: GastronomicCulture = {
      id: '',
      name: faker.word.adjective(),
      description: faker.lorem.lines(),
      recipes: [],
      restaurants: [],
      countries: [],
    };

    const newGastronomicCulture: GastronomicCulture = await service.create(
      gastronomicCulture,
    );
    expect(newGastronomicCulture).not.toBeNull();

    const storedGastronomicCulture: GastronomicCultureDTO =
      await repository.findOne({ where: { id: newGastronomicCulture.id } });
    expect(storedGastronomicCulture).not.toBeNull();
    expect(storedGastronomicCulture.name).toEqual(newGastronomicCulture.name);
    expect(storedGastronomicCulture.description).toEqual(
      newGastronomicCulture.description,
    );
  });

  it('update should modify a gastronomicCulture', async () => {
    const gastronomicCulture: GastronomicCulture = gastronomicCultureList[0];
    gastronomicCulture.name = 'New name';
    gastronomicCulture.description = 'New description';
    const updatedGastronomicCulture: GastronomicCultureDTO =
      await service.update(gastronomicCulture.id, gastronomicCulture);
    expect(updatedGastronomicCulture).not.toBeNull();
    const storedGastronomicCulture: GastronomicCulture =
      await repository.findOne({ where: { id: gastronomicCulture.id } });
    expect(storedGastronomicCulture).not.toBeNull();
    expect(storedGastronomicCulture.name).toEqual(gastronomicCulture.name);
    expect(storedGastronomicCulture.description).toEqual(
      gastronomicCulture.description,
    );
  });

  it('update should throw an exception for an invalid gastronomicCulture', async () => {
    let gastronomicCulture: GastronomicCulture = gastronomicCultureList[0];
    gastronomicCulture = {
      ...gastronomicCulture,
      name: 'New name',
    };
    await expect(() =>
      service.update('0', gastronomicCulture),
    ).rejects.toHaveProperty(
      'message',
      'The Gastronomic Culture with the given id was not found',
    );
  });

  it('delete should remove a gastronomicCulture', async () => {
    const gastronomicCulture: GastronomicCulture = gastronomicCultureList[0];
    await service.delete(gastronomicCulture.id);
    const deletedGastronomicCulturey: GastronomicCulture =
      await repository.findOne({ where: { id: gastronomicCulture.id } });
    expect(deletedGastronomicCulturey).toBeNull();
  });

  it('delete should throw an exception for an invalid gastronomicCulture', async () => {
    const gastronomicCulture: GastronomicCulture = gastronomicCultureList[0];
    await service.delete(gastronomicCulture.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The Gastronomic Culture with the given id was not found',
    );
  });
});
