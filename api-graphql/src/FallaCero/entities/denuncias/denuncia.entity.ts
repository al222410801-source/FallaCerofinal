import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {Ciudadano} from '../ciudadanos/ciudadano.entity';
import {DetEvidencia} from '../det-evidencias/det-evidencia.entity';

@ObjectType()
@Entity('denuncias')
export class Denuncia {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_denuncia!: number;

  @Field(() => Int)
  @Column({type: "int"})
  ciudadano_id!: number;


  @Field(() => String)
  @Column()
  titulo!: string;

  @Field(() => Date)
  @Column({type: "date"})
  fecha_denuncia!: Date;

  @Field(() => String)
  @Column()
  categoria!: string;

  @Field(() => String)
  @Column()
  prioridad!: string;

  @Field(() => Ciudadano, {nullable: true})
  @ManyToOne(() => Ciudadano, ciudadano => ciudadano.denuncias)
  @JoinColumn({name: 'ciudadano_id'})
  ciudadano?: Ciudadano;

  // seguimiento and seguimiento_id removed

  @Field(() => [DetEvidencia], {nullable: true})
  @OneToMany(() => DetEvidencia, det => det.denuncia)
  detEvidencias?: DetEvidencia[];
}
