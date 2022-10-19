import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';

jest.mock('./country.service');

describe('CountryController', () => {
  let controller: CountryController;
  let spyService: CountryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [CountryController],
      providers: [CountryService],
    }).compile();

    controller = module.get<CountryController>(CountryController);
    spyService = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling findOne method', () => {
    controller.findOne('1');
    expect(spyService.findOne).toHaveBeenCalled();
  });

  it('calling create method', () => {
    const mockCountry = {
      id: faker.random.alphaNumeric(),
      name: faker.word.adjective(),
      cities: [],
    };
    controller.create(mockCountry);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling update method', () => {
    const countryId = faker.random.alphaNumeric();
    const mockCountry = {
      id: countryId,
      name: faker.word.adjective(),
      cities: [],
    };
    controller.update(countryId, mockCountry);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling delete method', () => {
    controller.delete('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
