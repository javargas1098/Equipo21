/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from '../country/country.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class City {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field((type) => Country)
  @ManyToOne(() => Country, (country) => country.cities)
  country: Country;

  @Field((type) => [Restaurant])
  @OneToMany(() => Restaurant, (restaurant) => restaurant.cities)
  @JoinTable()
  restaurants: Restaurant[];
}
