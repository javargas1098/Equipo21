import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './city.entity';
import { Country } from '../country/country.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { CityResolver } from './city.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Country]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  providers: [CityService, CityResolver],
  controllers: [CityController],
})
export class CityModule {}
