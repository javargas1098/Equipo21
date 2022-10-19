import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';

import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { GastronomicCulture } from './gastronomic-culture.entity';
import { GastronomicCultureDTO } from './gastronomic-culture.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GastronomicCultureService {
  cacheKey: string = 'gastronomicCultures';

  constructor(
    @InjectRepository(GastronomicCulture)
    private readonly gastronomicCultureRepository: Repository<GastronomicCulture>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<GastronomicCultureDTO[]> {
    const cached: GastronomicCultureDTO[] = await this.cacheManager.get<
      GastronomicCultureDTO[]
    >(this.cacheKey);
    if (!cached) {
      const gastronomicCultures: GastronomicCultureDTO[] =
        await this.gastronomicCultureRepository.find({
          loadRelationIds: true,
        });
      await this.cacheManager.set(this.cacheKey, gastronomicCultures);
      return gastronomicCultures;
    }

    return cached;
  }

  async findOne(id: string): Promise<GastronomicCultureDTO> {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        'The Gastronomic Culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else return gastronomicCulture;
  }

  async create(
    gastronomicCultureDTO: GastronomicCulture,
  ): Promise<GastronomicCulture> {
    const gastronomicCulture = new GastronomicCulture();
    gastronomicCulture.name = gastronomicCultureDTO.name;
    gastronomicCulture.description = gastronomicCultureDTO.description;

    return await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async update(
    id: string,
    gastronomicCultureDTO: GastronomicCultureDTO,
  ): Promise<GastronomicCultureDTO> {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        'The Gastronomic Culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    gastronomicCulture.name = gastronomicCultureDTO.name;
    gastronomicCulture.description = gastronomicCultureDTO.description;
    await this.gastronomicCultureRepository.save(gastronomicCulture);
    return gastronomicCulture;
  }

  async delete(id: string) {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
    });
    if (!gastronomicCulture)
      throw new BusinessLogicException(
        'The Gastronomic Culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    else
      return await this.gastronomicCultureRepository.remove(gastronomicCulture);
  }
}
