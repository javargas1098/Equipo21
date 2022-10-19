import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { City } from '../city/city.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { Repository } from 'typeorm';
import { CityRestaurantService } from './city-restaurant.service';

describe('CityRestaurantService', () => {
  let service: CityRestaurantService;
  let cityRepository: Repository<City>;
  let resturantRepository: Repository<Restaurant>;
  let city: City;
  let restaurantsList: Restaurant[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CityRestaurantService],
    }).compile();

    service = module.get<CityRestaurantService>(CityRestaurantService);
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
    resturantRepository = module.get<Repository<Restaurant>>(
      getRepositoryToken(Restaurant),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    resturantRepository.clear();
    cityRepository.clear();
    restaurantsList = [];

    for (let i = 0; i < 5; i++) {
      const restaurant = new Restaurant();
      restaurant.name = faker.word.adjective();
      restaurant.stars = faker.datatype.number({ min: 0, max: 5 });
      restaurant.date = faker.date.past();
      await resturantRepository.save(restaurant);
      restaurantsList.push(restaurant);
    }

    city = await cityRepository.save({
      name: faker.word.adjective(),
      restaurants: restaurantsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('associateRestaurantCity should add an restaurant to a city', async () => {
    const restaurant: Restaurant = await resturantRepository.save({
      name: faker.word.adjective(),
      stars: faker.datatype.number({ min: 0, max: 5 }),
      date: faker.date.past(),
    });

    const updatedCity = await service.associateRestaurantCity(city.id, [
      restaurant,
    ]);
    expect(updatedCity.restaurants.length).toBe(1);

    expect(updatedCity.restaurants[0]).not.toBeNull();
    expect(updatedCity.restaurants[0].name).toBe(restaurant.name);
    expect(updatedCity.restaurants[0].stars).toBe(restaurant.stars);
    expect(updatedCity.restaurants[0].date).toBe(restaurant.date);
  });

  it('associateRestaurantCity should thrown exception for an invalid city', async () => {
    const restaurant: Restaurant = await resturantRepository.save({
      name: faker.word.adjective(),
      stars: faker.datatype.number({ min: 0, max: 5 }),
      date: faker.date.past(),
    });

    await expect(() =>
      service.associateRestaurantCity('0', [restaurant]),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('associateRestaurantCity should thrown exception for an invalid restaurant', async () => {
    const restaurant = restaurantsList[0];
    restaurant.id = '0';

    await expect(() =>
      service.associateRestaurantCity(city.id, [restaurant]),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
});
