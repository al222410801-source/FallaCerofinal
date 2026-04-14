import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {Denuncia} from '../denuncias/denuncia.entity';
import {Usuario} from '../usuarios/usuario.entity';

@ObjectType()
@Entity('ciudadanos')
export class Ciudadano {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_ciudadano!: number;


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
  correo!: string;

  @Field(() => String)
  // password_hash is stored but not exposed via GraphQL for ciudadanos
  @Column({nullable: true})
  password_hash?: string;

  @Field(() => Int, {nullable: true})
  @Column({type: 'int', nullable: true})
  usuario_id?: number;

  @Field(() => Usuario, {nullable: true})
  @ManyToOne(() => Usuario, {nullable: true})
  @JoinColumn({name: 'usuario_id'})
  usuario?: Usuario;

  @Field(() => String)
  @Column()
  telefono!: string;

  @Field(() => Date)
  @Column({type: "timestamp"})
  fecha_registro!: Date;

  @Field(() => [Denuncia], {nullable: true})
  @OneToMany(() => Denuncia, (denuncia: Denuncia) => denuncia.ciudadano)
  denuncias?: Denuncia[];
}
