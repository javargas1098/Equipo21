/* eslint-disable @typescript-eslint/no-unused-vars */
import { GastronomicCulture } from '../gastronomic-culture/gastronomic-culture.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../city/city.entity';

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Restaurant {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  stars: number;

  @Field()
  @Column()
  date: Date;

  // @Field(type => [GastronomicCulture])
  @ManyToOne(
    () => GastronomicCulture,
    (gastronomicCulture) => gastronomicCulture.restaurants,
  )
  @JoinTable()
  gastronomicCultures: GastronomicCulture[];

  @Field((type) => [City])
  @ManyToOne(() => City, (city) => city.restaurants)
  @JoinTable()
  cities: City[];
}
