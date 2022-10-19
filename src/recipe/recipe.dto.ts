import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType()
export class RecipeDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  readonly photo: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  readonly video: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly preparationProcess: string;
}
