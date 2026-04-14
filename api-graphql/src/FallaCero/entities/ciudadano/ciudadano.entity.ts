import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {ObjectType, Field, ID} from "@nestjs/graphql";

@ObjectType()
@Entity('ciudadanos')
export class Ciudadano {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id_ciudadano: number;


  @Field(() => String)
  @Column()
  nombre: string;

  @Field(() => String)
  @Column()
  apellido_p: string;

  @Field(() => String)
  @Column()
  apellido_m: string;

  @Field(() => String)
  @Column({unique: true})
  correo: string;

  @Field(() => String)
  @Column()
  telefono: string;

  @Field(() => Date)
  @Column({type: "timestamp"})
  fecha_registro: Date;
}
