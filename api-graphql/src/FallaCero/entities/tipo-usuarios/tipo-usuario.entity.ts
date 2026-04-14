import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {ObjectType, Field, ID} from "@nestjs/graphql";

@ObjectType()
@Entity('tipo_usuarios')
export class TipoUsuario {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_tipo_usuario!: number;

  @Field(() => String)
  @Column({unique: true})
  nombre!: string;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  descripcion?: string;

  @Field(() => Boolean, {nullable: true})
  @Column({type: 'boolean', default: false})
  us_ciudadano?: boolean;

  @Field(() => Boolean, {nullable: true})
  @Column({type: 'boolean', default: false})
  us_servidor?: boolean;

  @Field(() => Boolean, {nullable: true})
  @Column({type: 'boolean', default: false})
  us_administrador?: boolean;
}
