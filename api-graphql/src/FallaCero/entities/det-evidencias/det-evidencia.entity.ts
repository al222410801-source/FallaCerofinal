import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import {ObjectType, Field, ID, Int} from "@nestjs/graphql";
import {Denuncia} from '../denuncias/denuncia.entity';
import {Evidencia} from '../evidencias/evidencia.entity';

@ObjectType()
@Entity('det_evidencias')
export class DetEvidencia {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_det_evidencia!: number;

  @Field(() => Int)
  @Column({type: "int"})
  denuncia_id!: number;

  @Field(() => Int)
  @Column({type: "int"})
  evidencia_id!: number;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  descripcion?: string;

  @Field(() => Denuncia, {nullable: true})
  @ManyToOne(() => Denuncia, (denuncia: Denuncia) => denuncia.detEvidencias, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'denuncia_id'})
  denuncia?: Denuncia;

  @Field(() => Evidencia, {nullable: true})
  @ManyToOne(() => Evidencia, (evidencia: Evidencia) => evidencia.detEvidencias, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'evidencia_id'})
  evidencia?: Evidencia;
}
