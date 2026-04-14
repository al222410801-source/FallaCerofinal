import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {EstadoSeguimiento} from '../../enums/estado-seguimiento.enum';
import {Ciudadano} from '../ciudadanos/ciudadano.entity';
import {Denuncia} from '../denuncias/denuncia.entity';
import {ServidorPublico} from '../servidores-publicos/servidor-publico.entity';

@ObjectType()
@Entity('historial_estados')
export class HistorialEstado {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_historial!: number;

  @Field(() => Date)
  @Column({type: "date"})
  fecha!: Date;

  @Field(() => String)
  @Column()
  observaciones!: string;

  // seguimiento_id removed

  @Field(() => EstadoSeguimiento)
  @Column({type: 'varchar', length: 50, default: EstadoSeguimiento.RECIBIDO})
  estado!: EstadoSeguimiento;

  @Field(() => Int, {nullable: true})
  @Column({type: 'int', nullable: true})
  ciudadano_id?: number;

  @Field(() => Int, {nullable: true})
  @Column({type: 'int', nullable: true})
  denuncia_id?: number;

  @Field(() => Int, {nullable: true})
  @Column({type: 'int', nullable: true})
  servidor_publico_id?: number;

  // seguimiento relation removed

  @Field(() => Ciudadano, {nullable: true})
  @ManyToOne(() => Ciudadano, {nullable: true})
  @JoinColumn({name: 'ciudadano_id'})
  ciudadano?: Ciudadano;

  @Field(() => Denuncia, {nullable: true})
  @ManyToOne(() => Denuncia, {nullable: true})
  @JoinColumn({name: 'denuncia_id'})
  denuncia?: Denuncia;

  @Field(() => ServidorPublico, {nullable: true})
  @ManyToOne(() => ServidorPublico, {nullable: true})
  @JoinColumn({name: 'servidor_publico_id'})
  servidor_publico?: ServidorPublico;
}
