import {ObjectType, Field, Int} from '@nestjs/graphql';

@ObjectType()
export class DenunciasStats {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  atendidos: number;

  @Field(() => Int)
  porcentaje: number;
}
