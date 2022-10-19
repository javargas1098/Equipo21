/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from '../city/city.entity';
import { GastronomicCulture } from '../gastronomic-culture/gastronomic-culture.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Country {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field((type) => GastronomicCulture)
  @ManyToOne(
    () => GastronomicCulture,
    (gastronomicCulture) => gastronomicCulture.countries,
  )
  gastronomicCulture: GastronomicCulture;

  @Field((type) => [City])
  @OneToMany(() => City, (city) => city.country)
  cities: City[];
}
