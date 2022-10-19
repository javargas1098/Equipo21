/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from '../country/country.entity';
import { Recipe } from '../recipe/recipe.entity';
import { Restaurant } from '../restaurant/restaurant.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class GastronomicCulture {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  // @Field((type) => Recipe)
  @OneToMany(() => Recipe, (recipe) => recipe.gastronomicCulture)
  recipes: Recipe[];

  // @Field((type) => Restaurant)
  @OneToMany(() => Restaurant, (restaurant) => restaurant.gastronomicCultures)
  restaurants: Restaurant[];

  @Field((type) => Country)
  @OneToMany(() => Country, (country) => country.gastronomicCulture)
  countries: Country[];
}
