import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateEvidenciaInput} from './create-evidencia.input';

@InputType()
export class UpdateEvidenciaInput extends PartialType(CreateEvidenciaInput) {
  @Field(() => ID)
  @IsNumber()
  id_evidencia: number;
}
