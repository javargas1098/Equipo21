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
});
