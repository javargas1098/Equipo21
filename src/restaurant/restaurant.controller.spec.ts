import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

jest.mock('./restaurant.service');

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let spyService: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      controllers: [RestaurantController],
      providers: [RestaurantService],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    spyService = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling getAllRestaurants method', () => {
    controller.getAllRestaurants();
    expect(spyService.findAll).toHaveBeenCalled();
  });

  it('calling getRestaurantById method', () => {
    controller.getRestaurantById('1');
    expect(spyService.findOne).toHaveBeenCalled();
  });

  it('calling createRestaurant method', () => {
    const mockRestaurant = {
      name: faker.word.adjective(),
      stars: faker.datatype.number({ min: 0, max: 5 }),
      date: faker.date.past(),
      gastronomicCultures: [],
      cities: [],
    };
    controller.createRestaurant(mockRestaurant);
    expect(spyService.create).toHaveBeenCalled();
  });

  it('calling updateRestaurantById method', () => {
    const restaurantId = faker.random.alphaNumeric();
    const mockRestaurant = {
      id: restaurantId,
      name: faker.word.adjective(),
      stars: faker.datatype.number({ min: 0, max: 5 }),
      date: faker.date.past(),
      gastronomicCultures: [],
      cities: [],
    };
    controller.updateRestaurantById(restaurantId, mockRestaurant);
    expect(spyService.update).toHaveBeenCalled();
  });

  it('calling deleteRestaurant method', () => {
    controller.deleteRestaurant('1');
    expect(spyService.delete).toHaveBeenCalled();
  });
});
