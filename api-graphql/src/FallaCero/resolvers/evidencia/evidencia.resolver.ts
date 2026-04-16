import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Evidencia} from 'src/FallaCero/entities';
import {EvidenciaService} from 'src/FallaCero/services';
import {CreateEvidenciaInput} from 'src/FallaCero/dtos/Evidencia/create-evidencia.input';
import {UpdateEvidenciaInput} from 'src/FallaCero/dtos/Evidencia/update-Evidencia.input';

@Resolver(() => Evidencia)
export class EvidenciaResolver {
  constructor(private readonly service: EvidenciaService) {}

  @Query(() => [Evidencia], {name: 'evidencias'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Evidencia], {name: 'evidenciasP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => Number, {name: 'evidenciasCount'})
  evidenciasCount() {
    return this.service.count();
  }

  @Query(() => Evidencia, {name: 'evidencia'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Evidencia, {name: 'createEvidencia'})
  create(@Args('input') input: CreateEvidenciaInput) {
    return this.service.create(input);
  }

  @Mutation(() => Evidencia, {name: 'updateEvidencia'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateEvidenciaInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeEvidencia'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
