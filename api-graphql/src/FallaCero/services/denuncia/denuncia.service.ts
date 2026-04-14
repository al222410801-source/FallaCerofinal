import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Denuncia} from 'src/FallaCero/entities';
import {CreateDenunciaInput} from 'src/FallaCero/dtos/denuncia/create-denuncia.input';
import {UpdateDenunciaInput} from 'src/FallaCero/dtos/denuncia/update-denuncia.input';
import {laplace} from 'src/utils/forecast.util';

@Injectable()
export class DenunciaService {
  constructor(
    @InjectRepository(Denuncia)
    private repository: Repository<Denuncia>
  ) {}

  async create(data: CreateDenunciaInput): Promise<Denuncia> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<Denuncia[]> {
    return await this.repository.find({ relations: ['ciudadano', 'detEvidencias'] });
  }

  async findAllPaginate(page: number = 1, limit: number = 10, q?: string): Promise<Denuncia[]> {
    const skip = (page - 1) * limit;
    const qb = this.repository.createQueryBuilder('d')
      .leftJoinAndSelect('d.ciudadano', 'c')
      .leftJoinAndSelect('d.detEvidencias', 'de')
      .orderBy('d.id_denuncia', 'ASC')
      .skip(skip)
      .take(limit);

    if (q && q.trim().length > 0) {
      const qLike = `%${q}%`;
      qb.where('d.titulo ILIKE :q OR CAST(d.id_denuncia AS TEXT) ILIKE :q', {q: qLike});
    }

    return await qb.getMany();
  }

  async findOne(id_denuncia: number): Promise<Denuncia> {
    return await this.repository.findOne({where: {id_denuncia}, relations: ['ciudadano', 'detEvidencias']});
  }

  async update(id_denuncia: number, data: UpdateDenunciaInput): Promise<Denuncia> {
    data.id_denuncia = id_denuncia;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Not found id_denuncia: ${id_denuncia}`);
    }
    await this.repository.save(register);
    return await this.repository.findOne({where: {id_denuncia}, relations: ['ciudadano', 'detEvidencias']});
  }

  async remove(id_denuncia: number): Promise<boolean> {
    const result = await this.repository.delete({id_denuncia});
    return result.affected ? result.affected > 0 : false;
  }

  // Predicción de volumen de denuncias por mes usando suavizado exponencial (Laplace discreta)
  async prediccionDenunciasPorMes(mesesHistorico = 8, factorS = 0.10) {
    const mesExpr = `TO_CHAR(d.fecha_denuncia, 'YYYY-MM')`;
    const rows = await this.repository.createQueryBuilder('d')
      .select(mesExpr, 'mes')
      .addSelect('COUNT(*)', 'total')
      .groupBy('mes')
      .orderBy('mes', 'DESC')
      .limit(mesesHistorico)
      .getRawMany();

    // Si no hay datos devolver estructura vacía
    if (!rows.length) {
      return {
        mes_predicho: new Date().toISOString().slice(0,7),
        prediccion: 0,
        alpha: Math.exp(-factorS),
        confianza_pct: 0,
        meses_analizados: 0,
      };
    }

    // rows vienen ordenados por mes DESC (recientes primero). Construir serie ascendente.
    const labelsDesc = rows.map(r => r.mes);
    const serieDesc = rows.map(r => +r.total);
    const labels = labelsDesc.slice().reverse();
    const serie = serieDesc.slice().reverse();

    const {prediccion, alpha, confianza_pct} = laplace(serie, factorS);

    const mes_predicho = (() => {
      const ultimoMes = rows[0].mes; // formato YYYY-MM
      const [y, m] = ultimoMes.split('-').map(Number);
      const siguiente = new Date(y, m, 1);
      return `${siguiente.getFullYear()}-${String(siguiente.getMonth()+1).padStart(2,'0')}`;
    })();

    return {
      mes_predicho,
      prediccion,
      alpha,
      confianza_pct,
      meses_analizados: rows.length,
      series: serie,
      labels: labels,
    };
  }
}
