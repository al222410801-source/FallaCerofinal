import {InputType, Field, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateTipousInput} from './create-tipous.input';

@InputType()
export class CreateTipoUsuarioInput extends CreateTipousInput {
}
