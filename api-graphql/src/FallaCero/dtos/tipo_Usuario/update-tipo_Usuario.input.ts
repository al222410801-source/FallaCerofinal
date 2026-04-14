import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateTipousInput} from './create-tipous.input';

@InputType()
export class UpdateTipoUsuarioInput extends PartialType(CreateTipousInput) {
  @Field(() => ID)
  @IsNumber()
  id_tipo_usuario: number;
}
