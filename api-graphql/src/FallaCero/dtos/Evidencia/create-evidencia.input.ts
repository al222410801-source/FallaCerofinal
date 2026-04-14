import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsString, IsNotEmpty,} from 'class-validator';

@InputType()
export class CreateEvidenciaInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  imagen: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  observaciones: string;
}
