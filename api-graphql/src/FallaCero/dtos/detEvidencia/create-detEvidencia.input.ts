import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

@InputType()
export class CreateDetEvidenciaInput {
  @Field(() => Int)
  @IsNumber()
  denuncia_id: number;

  @Field(() => Int)
  @IsNumber()
  evidencia_id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

}
