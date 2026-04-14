import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {ServidorPublico} from 'src/FallaCero/entities';
import {ServidorPublicoService} from 'src/FallaCero/services';
import {CreateServidorPublicoInput} from 'src/FallaCero/dtos/servidor_publico/create-servidor_publico.input';
import {UpdateServidorPublicoInput} from 'src/FallaCero/dtos/servidor_publico/update-servidor_publico.input';

@Resolver(() => ServidorPublico)
export class ServidorPublicoResolver {
  constructor(private readonly service: ServidorPublicoService) {}

  @Query(() => [ServidorPublico], {name: 'servidoresPublicos'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [ServidorPublico], {name: 'servidoresPublicosP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => ServidorPublico, {name: 'servidorPublico'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => ServidorPublico, {name: 'createServidorPublico'})
  create(@Args('input') input: CreateServidorPublicoInput) {
    return this.service.create(input);
  }

  @Mutation(() => ServidorPublico, {name: 'updateServidorPublico'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateServidorPublicoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeServidorPublico'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
