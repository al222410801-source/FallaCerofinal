import {InputType, Field, Int, ID} from '@nestjs/graphql';
import {IsNotEmpty, IsString, IsBoolean, IsOptional} from 'class-validator';

@InputType()
export class CreateTipousInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Field(() => Boolean, {nullable: true})
  @IsOptional()
  @IsBoolean()
  us_ciudadano?: boolean;

  @Field(() => Boolean, {nullable: true})
  @IsOptional()
  @IsBoolean()
  us_servidor?: boolean;

  @Field(() => Boolean, {nullable: true})
  @IsOptional()
  @IsBoolean()
  us_administrador?: boolean;
}
