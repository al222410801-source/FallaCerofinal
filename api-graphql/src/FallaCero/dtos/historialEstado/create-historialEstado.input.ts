import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';
import {EstadoSeguimiento} from '../../enums/estado-seguimiento.enum';
import {IsEnum, IsOptional} from 'class-validator';

@InputType()
export class CreateHistorialEstadoInput {
  @Field(() => Date)
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  observaciones: string;

  // seguimiento_id removed

  @Field(() => EstadoSeguimiento, {nullable: true})
  @IsOptional()
  @IsEnum(EstadoSeguimiento)
  estado?: EstadoSeguimiento;

  @Field(() => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  ciudadano_id?: number;

  @Field(() => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  denuncia_id?: number;

  @Field(() => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  servidor_publico_id?: number;
}
