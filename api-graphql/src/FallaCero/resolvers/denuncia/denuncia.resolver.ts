import {Resolver, Query, Mutation, Args, Int, Float} from '@nestjs/graphql';
import {Denuncia} from 'src/FallaCero/entities';
import {DenunciaService} from 'src/FallaCero/services';
import {CreateDenunciaInput} from 'src/FallaCero/dtos/denuncia/create-denuncia.input';
import {UpdateDenunciaInput} from 'src/FallaCero/dtos/denuncia/update-denuncia.input';
import {DenunciasStats} from 'src/FallaCero/dtos/denuncia/denuncias-stats.type';
import {DenunciasPrediction} from 'src/FallaCero/dtos/denuncia/denuncias-prediction.type';
import {HistorialEstadoService} from 'src/FallaCero/services';

@Resolver(() => Denuncia)
export class DenunciaResolver {
  constructor(private readonly service: DenunciaService, private readonly historialService: HistorialEstadoService) {}

  @Query(() => [Denuncia], {name: 'denuncias'})
  findAll() {
    return this.service.findAll();
  }

  @Query(() => [Denuncia], {name: 'denunciasP'})
  findAllPaginate(
    @Args('page', {type: () => Int, nullable: true, defaultValue: 1}) page: number,
    @Args('limit', {type: () => Int, nullable: true, defaultValue: 10}) limit: number,
    @Args('q', {type: () => String, nullable: true}) q: string,
  ) {
    return this.service.findAllPaginate(page, limit, q);
  }

  @Query(() => Number, {name: 'denunciasCount'})
  denunciasCount(@Args('q', {type: () => String, nullable: true}) q?: string) {
    return this.service.count(q);
  }

  @Query(() => Denuncia, {name: 'denuncia'})
  findOne(@Args('id', {type: () => Int}) id: number) {
    return this.service.findOne(id);
  }

  @Mutation(() => Denuncia, {name: 'createDenuncia'})
  create(@Args('input') input: CreateDenunciaInput) {
    return this.service.create(input);
  }

  @Mutation(() => Denuncia, {name: 'updateDenuncia'})
  update(@Args('id', {type: () => Int}) id: number, @Args('input') input: UpdateDenunciaInput) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, {name: 'removeDenuncia'})
  remove(@Args('id', {type: () => Int}) id: number) {
    return this.service.remove(id);
  }

  @Query(() => DenunciasStats, {name: 'denunciasStats'})
  async denunciasStats() {
    return await this.historialService.getDenunciasStats();
  }

  @Query(() => DenunciasPrediction, {name: 'denunciasPrediction'})
  async denunciasPrediction(
    @Args('meses', {type: () => Int, nullable: true, defaultValue: 8}) meses: number,
    @Args('factorS', {type: () => Float, nullable: true, defaultValue: 0.1}) factorS: number,
  ) {
    return await this.service.prediccionDenunciasPorMes(meses, factorS);
  }
}
