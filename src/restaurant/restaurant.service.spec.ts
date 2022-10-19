import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './restaurant.entity';
import { faker } from '@faker-js/faker';
import { RestaurantDTO } from './restaurant.dto';
import { CacheModule } from '@nestjs/common';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<Restaurant>;
  let restaurantList: Restaurant[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<Restaurant>>(
      getRepositoryToken(Restaurant),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restaurantList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant = new Restaurant();
      restaurant.name = faker.word.adjective();
      restaurant.stars = faker.datatype.number({ min: 0, max: 5 });
      restaurant.date = faker.date.past();
      await repository.save(restaurant);
      restaurantList.push(restaurant);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findAll should return all restaurants', async () => {
    const restaurant: RestaurantDTO[] = await service.findAll();
    expect(restaurant).not.toBeNull();
    expect(restaurant).toHaveLength(restaurantList.length);
  });

  it('findOne should return a restaurant by id', async () => {
    const storedRestaurant: Restaurant = restaurantList[0];
    const restaurant: RestaurantDTO = await service.findOne(
      storedRestaurant.id,
    );
    expect(restaurant).not.toBeNull();
    expect(restaurant.name).toEqual(storedRestaurant.name);
    expect(restaurant.stars).toEqual(storedRestaurant.stars);
    expect(restaurant.date).toEqual(storedRestaurant.date);
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The Restaurant with the given id was not found',
    );
  });

  it('create should return a new restaurant', async () => {
    const restaurant: Restaurant = {
      id: '',
      name: faker.word.adjective(),
      stars: faker.datatype.number({ min: 0, max: 5 }),
      date: faker.date.past(),
      gastronomicCultures: [],
      cities: [],
    };
    const newRestaurant: Restaurant = await service.create(restaurant);
    expect(newRestaurant).not.toBeNull();

    const storedRestaurant: Restaurant = await repository.findOne({
      where: { id: newRestaurant.id },
    });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(newRestaurant.name);
    expect(storedRestaurant.date).toEqual(newRestaurant.date);
    expect(storedRestaurant.stars).toEqual(newRestaurant.stars);
  });

  it('update should modify a restaurant', async () => {
    const restaurant: Restaurant = restaurantList[0];
    restaurant.name = 'New name';
    restaurant.stars = 2;
    const updatedRestaurant: RestaurantDTO = await service.update(
      restaurant.id,
      restaurant,
    );
    expect(updatedRestaurant).not.toBeNull();
    const storedRestaurant: Restaurant = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(restaurant.name);
    expect(storedRestaurant.stars).toEqual(restaurant.stars);
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurant: Restaurant = restaurantList[0];
    restaurant = {
      ...restaurant,
      name: 'New name',
    };
    await expect(() => service.update('0', restaurant)).rejects.toHaveProperty(
      'message',
      'The Restaurant with the given id was not found',
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurant: Restaurant = restaurantList[0];
    await service.delete(restaurant.id);
    const deleteRestaurant: Restaurant = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(deleteRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    const restaurant: Restaurant = restaurantList[0];
    await service.delete(restaurant.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The Restaurant with the given id was not found',
    );
  });
});
