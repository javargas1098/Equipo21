import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CountryDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
