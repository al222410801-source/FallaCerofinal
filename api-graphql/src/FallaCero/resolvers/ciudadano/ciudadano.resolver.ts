import {Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import {Ciudadano} from 'src/FallaCero/entities';
import {CiudadanoService} from 'src/FallaCero/services';
import {CreateCiudadanoInput} from 'src/FallaCero/dtos/ciudadano/create-ciudadano.input';
import {UpdateCiudadanoInput} from 'src/FallaCero/dtos/ciudadano/update-ciudadano.input';

@Resolver(() => Ciudadano)
export class CiudadanoResolver {
  constructor(private readonly service: CiudadanoService) {}

  @Query(() => [Ciudadano], {name: 'ciudadanos'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Ciudadano], {name: 'ciudadanosP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
  ) {
    return this.service.findAllPaginate(page, limit);
  }

  @Query(() => Number, {name: 'ciudadanosCount'})
  ciudadanosCount() {
    return this.service.count();
  }

  @Query(() => Ciudadano, {name: 'ciudadano'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Ciudadano, {name: 'createCiudadano'})
  create(@Args('input') input: CreateCiudadanoInput) {
    return this.service.create(input);
  }

  @Mutation(() => Ciudadano, {name: 'updateCiudadano'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateCiudadanoInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeCiudadano'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }
}
