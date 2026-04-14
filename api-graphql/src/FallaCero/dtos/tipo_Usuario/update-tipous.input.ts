import {InputType, Field, PartialType, ID} from '@nestjs/graphql';
import {IsNumber} from 'class-validator';
import {CreateTipousInput} from './create-tipous.input';

@InputType()
export class UpdateTipousInput extends PartialType(CreateTipousInput) {
  @Field(() => ID)
  @IsNumber()
  id_tipous: number;
}
