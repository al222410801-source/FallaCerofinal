import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ServidorPublico} from 'src/FallaCero/entities';
import {CreateServidorPublicoInput} from 'src/FallaCero/dtos/servidor_publico/create-servidor_publico.input';
import {UpdateServidorPublicoInput} from 'src/FallaCero/dtos/servidor_publico/update-servidor_publico.input';
// password handling removed for ServidorPublico via API

@Injectable()
export class ServidorPublicoService {
  constructor(
    @InjectRepository(ServidorPublico)
    private repository: Repository<ServidorPublico>
  ) {}

  async create(data: CreateServidorPublicoInput): Promise<ServidorPublico> {
    const register = this.repository.create(data);
    return await this.repository.save(register);
  }

  async findAll(): Promise<ServidorPublico[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<ServidorPublico[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_servidor: 'ASC'},
    });
  }

  async findOne(id_servidor: number): Promise<ServidorPublico> {
    return await this.repository.findOneBy({id_servidor});
  }

  async update(id_servidor: number, data: UpdateServidorPublicoInput): Promise<ServidorPublico> {
    data.id_servidor = id_servidor;
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Not found id_servidor: ${id_servidor}`);
    }
    return await this.repository.save(register);
  }

  async remove(id_servidor: number): Promise<boolean> {
    const result = await this.repository.delete({id_servidor});
    return result.affected ? result.affected > 0 : false;
  }
}
