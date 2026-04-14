import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Evidencia} from 'src/FallaCero/entities';
import {CreateEvidenciaInput} from 'src/FallaCero/dtos/Evidencia/create-evidencia.input';
import {UpdateEvidenciaInput} from 'src/FallaCero/dtos/Evidencia/update-Evidencia.input';

@Injectable()
export class EvidenciaService {
  constructor(
    @InjectRepository(Evidencia)
    private repository: Repository<Evidencia>
  ) {}

  async create(data: CreateEvidenciaInput): Promise<Evidencia> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Evidencia[]> {
    return await this.repository.find({ relations: ['detEvidencias'] });
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<Evidencia[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_evidencia: 'ASC'},
      relations: ['detEvidencias'],
    });
  }

  async findOne(id_evidencia: number): Promise<Evidencia> {
    return await this.repository.findOne({where: {id_evidencia}, relations: ['detEvidencias']});
  }

  async update(id_evidencia: number, data: UpdateEvidenciaInput): Promise<Evidencia> {
    data.id_evidencia = id_evidencia;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Not found id_evidencia: ${id_evidencia}`);
    }
    await this.repository.save(register);
    return await this.repository.findOne({where: {id_evidencia}, relations: ['detEvidencias']});
  }

  async remove(id_evidencia: number): Promise<boolean> {
    const result = await this.repository.delete({id_evidencia});
    return result.affected ? result.affected > 0 : false;
  }
}
