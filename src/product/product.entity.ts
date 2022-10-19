/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Recipe } from '../recipe/recipe.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Product {
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
  history: string;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Field(() => Recipe)
  @ManyToMany(() => Recipe, (recipe) => recipe.products)
  @JoinTable()
  recipes: Recipe[];
}
