import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CityDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
