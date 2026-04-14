import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {Usuario} from '../usuarios/usuario.entity';

@ObjectType()
@Entity('servidores_publicos')
export class ServidorPublico {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_servidor!: number;


  @Field(() => String)
  @Column()
  nombre!: string;

  @Field(() => String)
  @Column()
  apellido_p!: string;

  @Field(() => String)
  @Column()
  apellido_m!: string;

  @Field(() => String)
  @Column({unique: true})
  email_personal!: string;

  @Field(() => String)
  @Column()
  cargo!: string;

  @Field(() => String)
  @Column()
  telefono!: string;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  dependencia?: string;

  @Field(() => Int, {nullable: true})
  @Column({type: 'int', nullable: true})
  usuario_id?: number;

  @Field(() => Usuario, {nullable: true})
  @ManyToOne(() => Usuario, {nullable: true})
  @JoinColumn({name: 'usuario_id'})
  usuario?: Usuario;

  // seguimiento_id/relation removed

  @Field(() => Date)
  @Column({type: "timestamp"})
  fecha_ingreso!: Date;

  @Field(() => Boolean)
  @Column({type: "boolean", default: true})
  activo!: boolean;
}
