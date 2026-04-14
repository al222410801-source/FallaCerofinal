import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {HistorialEstado} from 'src/FallaCero/entities';
import {CreateHistorialEstadoInput} from 'src/FallaCero/dtos/historialEstado/create-historialEstado.input';
import {UpdateHistorialEstadoInput} from 'src/FallaCero/dtos/historialEstado/update-historialEstado.input';

@Injectable()
export class HistorialEstadoService {
  constructor(
    @InjectRepository(HistorialEstado)
    private repository: Repository<HistorialEstado>
  ) {}

  async create(data: CreateHistorialEstadoInput): Promise<HistorialEstado> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<HistorialEstado[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<HistorialEstado[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_historial: 'ASC'},
    });
  }

  async findOne(id_historial: number): Promise<HistorialEstado> {
    return await this.repository.findOneBy({id_historial});
  }

  async update(id_historial: number, data: UpdateHistorialEstadoInput): Promise<HistorialEstado> {
    data.id_historial = id_historial;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Not found id_historial: ${id_historial}`);
    }
    return await this.repository.save(register);
  }

  async remove(id_historial: number): Promise<boolean> {
    const result = await this.repository.delete({id_historial});
    return result.affected ? result.affected > 0 : false;
  }

  // Aggregated stats: count all historiales (rows) and count atendidos (estado RESUELTO/CERRADO)
  async getDenunciasStats(): Promise<{total: number; atendidos: number; porcentaje: number}> {
    // total historiales
    const totalRow: Array<{count: string}> = await this.repository.query(`SELECT COUNT(*)::text as count FROM historial_estados`);
    const total = totalRow && totalRow[0] ? Number(totalRow[0].count) : 0;

    // atendidos: rows where estado is RESUELTO or CERRADO
    const atendidosRow: Array<{count: string}> = await this.repository.query(`SELECT COUNT(*)::text as count FROM historial_estados WHERE estado IN ('RESUELTO','CERRADO')`);
    const atendidos = atendidosRow && atendidosRow[0] ? Number(atendidosRow[0].count) : 0;

    const porcentaje = total ? Math.round((atendidos / total) * 100) : 0;
    return {total, atendidos, porcentaje};
  }
}
