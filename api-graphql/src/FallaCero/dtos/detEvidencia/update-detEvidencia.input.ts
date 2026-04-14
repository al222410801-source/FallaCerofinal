import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateDetEvidenciaInput} from './create-detEvidencia.input';

@InputType()
export class UpdateDetEvidenciaInput extends PartialType(CreateDetEvidenciaInput) {
  @Field(() => ID)
  @IsNumber()
  id_det_evidencia: number;
}
