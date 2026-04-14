import {ObjectType, Field, Int, Float} from '@nestjs/graphql';

@ObjectType()
export class DenunciasPrediction {
  @Field()
  mes_predicho: string;

  @Field(() => Float)
  prediccion: number;

  @Field(() => Float)
  alpha: number;

  @Field(() => Float)
  confianza_pct: number;

  @Field(() => Int)
  meses_analizados: number;

  @Field(() => [Float], {nullable: true})
  series?: number[];

  @Field(() => [String], {nullable: true})
  labels?: string[];
}
