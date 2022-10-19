import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CityController } from './city.controller';
import { CityService } from './city.service';

jest.mock('./city.service');

describe('CityController', () => {
  let controller: CityController;
  let spyService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [CityController],
      providers: [CityService],
    }).compile();

    controller = module.get<CityController>(CityController);
    spyService = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling addCityCountry method', () => {
    const cityMock = {
      id: faker.random.alphaNumeric(),
      name: faker.word.adjective(),
    };
    controller.addCityCountry('1', cityMock);
    expect(spyService.addCityCountry).toHaveBeenCalled();
  });

  it('calling getCityByCountryIdCityId method', () => {
    controller.getCityByCountryIdCityId('1', '1');
    expect(spyService.findCityByCountryId).toHaveBeenCalled();
  });

  it('calling geCitiesByCountryId method', () => {
    controller.geCitiesByCountryId('1');
    expect(spyService.findAllCitiesByCountry).toHaveBeenCalled();
  });

  it('calling deleteCityToCountry method', () => {
    controller.deleteCityToCountry('1', '1');
    expect(spyService.deleteCityByCountry).toHaveBeenCalled();
  });
});
