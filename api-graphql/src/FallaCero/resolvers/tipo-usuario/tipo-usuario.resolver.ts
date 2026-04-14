import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {TipoUsuario} from 'src/FallaCero/entities';
import {TipoUsuarioService} from 'src/FallaCero/services';
import {CreateTipoUsuarioInput} from 'src/FallaCero/dtos/tipo_Usuario/create-tipo_Usuario.input';
import {UpdateTipoUsuarioInput} from 'src/FallaCero/dtos/tipo_Usuario/update-tipo_Usuario.input';

@Resolver(() => TipoUsuario)
export class TipoUsuarioResolver {
  constructor(private readonly service: TipoUsuarioService) {}

  @Query(() => [TipoUsuario], {name: 'tiposUsuarios'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [TipoUsuario], {name: 'tiposUsuariosP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => TipoUsuario, {name: 'tipoUsuario'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => TipoUsuario, {name: 'createTipoUsuario'})
  create(@Args('input') input: CreateTipoUsuarioInput) {
    return this.service.create(input);
  }

  @Mutation(() => TipoUsuario, {name: 'updateTipoUsuario'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateTipoUsuarioInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeTipoUsuario'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
