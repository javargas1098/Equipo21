import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCulture } from './gastronomic-culture.entity';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { GastronomicCultureController } from './gastronomic-culture.controller';
import { GastronomicCultureResolver } from './gastronomic-culture.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([GastronomicCulture]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  providers: [GastronomicCultureService, GastronomicCultureResolver],
  controllers: [GastronomicCultureController],
})
export class GastronomicCultureModule {}
