import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsPositive, IsString} from 'class-validator';

@InputType()
export class CreateDenunciaInput {
  @Field(() => Int)
  @IsNumber()
  ciudadano_id: number;



  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @Field(() => Date)
  @IsNotEmpty()
  fecha_denuncia: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  prioridad: string;
}
