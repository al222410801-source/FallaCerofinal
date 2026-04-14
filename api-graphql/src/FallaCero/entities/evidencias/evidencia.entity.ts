import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {ObjectType, Field, ID} from "@nestjs/graphql";
import {DetEvidencia} from '../det-evidencias/det-evidencia.entity';

@ObjectType()
@Entity('evidencias')
export class Evidencia {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_evidencia!: number;

  @Field(() => String)
  @Column()
  imagen!: string;

  @Field(() => String)
  @Column()
  observaciones!: string;

  @Field(() => [DetEvidencia], {nullable: true})
  @OneToMany(() => DetEvidencia, det => det.evidencia)
  detEvidencias?: DetEvidencia[];
}

