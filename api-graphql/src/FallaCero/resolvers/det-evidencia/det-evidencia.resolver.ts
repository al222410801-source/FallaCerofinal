import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {DetEvidencia} from 'src/FallaCero/entities';
import {DetEvidenciaService} from 'src/FallaCero/services';
import {CreateDetEvidenciaInput} from 'src/FallaCero/dtos/detEvidencia/create-detEvidencia.input';
import {UpdateDetEvidenciaInput} from 'src/FallaCero/dtos/detEvidencia/update-detEvidencia.input';

@Resolver(() => DetEvidencia)
export class DetEvidenciaResolver {
  constructor(private readonly service: DetEvidenciaService) {}

  @Query(() => [DetEvidencia], {name: 'detEvidencias'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [DetEvidencia], {name: 'detEvidenciasP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => DetEvidencia, {name: 'detEvidencia'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => DetEvidencia, {name: 'createDetEvidencia'})
  create(@Args('input') input: CreateDetEvidenciaInput) {
    return this.service.create(input);
  }

  @Mutation(() => DetEvidencia, {name: 'updateDetEvidencia'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateDetEvidenciaInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeDetEvidencia'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
