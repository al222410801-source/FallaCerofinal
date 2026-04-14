import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateHistorialEstadoInput} from './create-historialEstado.input';

@InputType()
export class UpdateHistorialEstadoInput extends PartialType(CreateHistorialEstadoInput) {
  @Field(() => ID)
  @IsNumber()
  id_historial: number;
}
