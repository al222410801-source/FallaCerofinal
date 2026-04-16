import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {TipoUsuario} from 'src/FallaCero/entities';
import {CreateTipoUsuarioInput} from 'src/FallaCero/dtos/tipo_Usuario/create-tipo_Usuario.input';
import {UpdateTipoUsuarioInput} from 'src/FallaCero/dtos/tipo_Usuario/update-tipo_Usuario.input';

@Injectable()
export class TipoUsuarioService {
  constructor(
    @InjectRepository(TipoUsuario)
    private repository: Repository<TipoUsuario>
  ) {}

  async create(data: CreateTipoUsuarioInput): Promise<TipoUsuario> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<TipoUsuario[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<TipoUsuario[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_tipo_usuario: 'ASC'},
    });
  }

  async count(): Promise<number> {
    const totalRow: Array<{count: string}> = await this.repository.query(`SELECT COUNT(*)::text as count FROM tipo_usuario`);
    const total = totalRow && totalRow[0] ? Number(totalRow[0].count) : 0;
    return total;
  }

  async findOne(id_tipo_usuario: number): Promise<TipoUsuario> {
    return await this.repository.findOneBy({id_tipo_usuario});
  }

  async update(id_tipo_usuario: number, data: UpdateTipoUsuarioInput): Promise<TipoUsuario> {
    data.id_tipo_usuario = id_tipo_usuario;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Not found id_tipo_usuario: ${id_tipo_usuario}`);
    }
    return await this.repository.save(register);
  }

  async remove(id_tipo_usuario: number): Promise<boolean> {
    const result = await this.repository.delete({id_tipo_usuario});
    return result.affected ? result.affected > 0 : false;
  }
}
