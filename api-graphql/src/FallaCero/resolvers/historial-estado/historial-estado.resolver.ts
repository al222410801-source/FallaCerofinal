import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {HistorialEstado} from 'src/FallaCero/entities';
import {HistorialEstadoService} from 'src/FallaCero/services';
import {CreateHistorialEstadoInput} from 'src/FallaCero/dtos/historialEstado/create-historialEstado.input';
import {UpdateHistorialEstadoInput} from 'src/FallaCero/dtos/historialEstado/update-historialEstado.input';

@Resolver(() => HistorialEstado)
export class HistorialEstadoResolver {
  constructor(private readonly service: HistorialEstadoService) {}

  @Query(() => [HistorialEstado], {name: 'historialesEstados'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [HistorialEstado], {name: 'historialesEstadosP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => Number, {name: 'historialesEstadosCount'})
  historialesEstadosCount() {
    return this.service.count();
  }

  @Query(() => HistorialEstado, {name: 'historialEstado'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => HistorialEstado, {name: 'createHistorialEstado'})
  create(@Args('input') input: CreateHistorialEstadoInput) {
    return this.service.create(input);
  }

  @Mutation(() => HistorialEstado, {name: 'updateHistorialEstado'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateHistorialEstadoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeHistorialEstado'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
