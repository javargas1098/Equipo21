/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../product/product.entity';
import { GastronomicCulture } from '../gastronomic-culture/gastronomic-culture.entity';

@ObjectType()
@Entity()
export class Recipe {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  photo: string;

  @Field()
  @Column()
  video: string;

  @Field()
  @Column()
  preparationProcess: string;

  //@Field((type) => [GastronomicCulture])
  @ManyToOne(
    () => GastronomicCulture,
    (gastronomicCulture) => gastronomicCulture.recipes,
  )
  gastronomicCulture: GastronomicCulture;

  //@Field((type) => [Product])
  @ManyToMany(() => Product, (product) => product.recipes)
  products: Product[];
}
