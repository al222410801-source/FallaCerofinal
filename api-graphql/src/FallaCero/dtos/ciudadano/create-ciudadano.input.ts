import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsBoolean, IsDateString, IsNotEmpty, IsString, IsOptional, IsNumber} from 'class-validator';

@InputType()
export class CreateCiudadanoInput {
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
  correo: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  // Note: ciudadanos do not carry passwords — password fields removed

  @Field(() => Int, {nullable: true})
  @IsOptional()
  @IsNumber()
  usuario_id?: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @Field(() => Date)
  @IsNotEmpty()
  fecha_registro: Date;

}
