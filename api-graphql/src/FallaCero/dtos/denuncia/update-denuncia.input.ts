import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateDenunciaInput} from './create-denuncia.input';

@InputType()
export class UpdateDenunciaInput extends PartialType(CreateDenunciaInput) {
  @Field(() => ID)
  @IsNumber()
  id_denuncia: number;
}
