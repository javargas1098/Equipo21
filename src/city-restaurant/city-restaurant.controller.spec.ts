import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CityRestaurantController } from './city-restaurant.controller';
import { CityRestaurantService } from './city-restaurant.service';

jest.mock('./city-restaurant.service');

describe('CityRestaurantController', () => {
  let controller: CityRestaurantController;
  let spyService: CityRestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [CityRestaurantController],
      providers: [CityRestaurantService],
    }).compile();

    controller = module.get<CityRestaurantController>(CityRestaurantController);
    spyService = module.get<CityRestaurantService>(CityRestaurantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling addRestaurantCity method', () => {
    const mockRestaurant = {
      id: faker.random.alphaNumeric(),
      name: faker.company.name(),
      stars: faker.datatype.number({ min: 0, max: 5 }),
      date: faker.date.past(),
      cities: [],
    };
    controller.addRestaurantCity('1', [mockRestaurant]);
    expect(spyService.associateRestaurantCity).toHaveBeenCalled();
  });
});
