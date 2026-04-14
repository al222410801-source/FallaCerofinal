import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber
} from 'class-validator';

@InputType()
export class CreateServidorPublicoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  apellido_p: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  apellido_m: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email_personal: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  cargo: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @Field(() => String, {nullable: true})
  @IsString()
  dependencia?: string;

  @Field(() => Date)
  @IsNotEmpty()
  fecha_ingreso: Date;

  @Field(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  activo: boolean;
  @Field(() => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  usuario_id?: number;
}
