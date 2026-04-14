import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {TipoUsuario} from '../tipo-usuarios/tipo-usuario.entity';

@ObjectType()
@Entity('usuarios')
export class Usuario {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_usuario!: number;

  @Field(() => String)
  @Column({unique: true})
  username!: string;

  @Field(() => String)
  @Column()
  password_hash!: string;

  @Field(() => Int)
  @Column({type: "int", name: 'id_tipo_usuario'})
  id_tipo_usuario!: number;

  @Field(() => Int, {nullable: true})
  @Column({type: "int", nullable: true})
  empleado_id?: number;

  @Field(() => Int, {nullable: true})
  @Column({type: "int", nullable: true})
  ciudadano_id?: number;

  @Field(() => String)
  @Column()
  avatar_url!: string;

  @Field(() => Date)
  @Column({type: "date"})
  ultimo_acceso!: Date;

  @Field(() => Boolean)
  @Column({type: "boolean", default: true})
  activo!: boolean;

  @Field(() => TipoUsuario, {nullable: true})
  @ManyToOne(() => TipoUsuario, {nullable: true})
  @JoinColumn({name: 'id_tipo_usuario'})
  tipoUsuario?: TipoUsuario;
}
