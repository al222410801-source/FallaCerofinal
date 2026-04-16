import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {DetEvidencia} from 'src/FallaCero/entities';
import {CreateDetEvidenciaInput} from 'src/FallaCero/dtos/detEvidencia/create-detEvidencia.input';
import {UpdateDetEvidenciaInput} from 'src/FallaCero/dtos/detEvidencia/update-detEvidencia.input';

@Injectable()
export class DetEvidenciaService {
  constructor(
    @InjectRepository(DetEvidencia)
    private repository: Repository<DetEvidencia>
  ) {}

  async create(data: CreateDetEvidenciaInput): Promise<DetEvidencia> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<DetEvidencia[]> {
    return await this.repository.find({ relations: ['denuncia', 'evidencia'] });
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<DetEvidencia[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_det_evidencia: 'ASC'},
      relations: ['denuncia', 'evidencia'],
    });
  }
  
  async count(): Promise<number> {
    const totalRow: Array<{count: string}> = await this.repository.query(`SELECT COUNT(*)::text as count FROM det_evidencias`);
    const total = totalRow && totalRow[0] ? Number(totalRow[0].count) : 0;
    return total;
  }

  async findOne(id_det_evidencia: number): Promise<DetEvidencia> {
    return await this.repository.findOne({where: {id_det_evidencia}, relations: ['denuncia', 'evidencia']});
  }

  async update(id_det_evidencia: number, data: UpdateDetEvidenciaInput): Promise<DetEvidencia> {
    data.id_det_evidencia = id_det_evidencia;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Not found id_det_evidencia: ${id_det_evidencia}`);
    }
    await this.repository.save(register);
    return await this.repository.findOne({where: {id_det_evidencia}, relations: ['denuncia', 'evidencia']});
  }

  async remove(id_det_evidencia: number): Promise<boolean> {
    const result = await this.repository.delete({id_det_evidencia});
    return result.affected ? result.affected > 0 : false;
  }
}
