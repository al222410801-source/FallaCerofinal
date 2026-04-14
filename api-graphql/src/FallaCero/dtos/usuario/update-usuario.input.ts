import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsOptional} from 'class-validator';
import {CreateUsuarioInput} from './create-usuario.input';

@InputType()
export class UpdateUsuarioInput extends PartialType(CreateUsuarioInput) {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  id_usuario?: number;
}
