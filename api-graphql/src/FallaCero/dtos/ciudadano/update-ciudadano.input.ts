import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateCiudadanoInput} from './create-ciudadano.input';

@InputType()
export class UpdateCiudadanoInput extends PartialType(CreateCiudadanoInput) {
  @Field(() => ID)
  @IsNumber()
  id_ciudadano: number;
}
