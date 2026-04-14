import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateServidorPublicoInput} from './create-servidor_publico.input';

@InputType()
export class UpdateServidorPublicoInput extends PartialType(CreateServidorPublicoInput) {
  @Field(() => ID)
  @IsNumber()
  id_servidor: number;
}
