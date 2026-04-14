import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Ciudadano} from 'src/FallaCero/entities';
import {CreateCiudadanoInput} from 'src/FallaCero/dtos/ciudadano/create-ciudadano.input';
import {UpdateCiudadanoInput} from 'src/FallaCero/dtos/ciudadano/update-ciudadano.input';

@Injectable()
export class CiudadanoService {
  constructor(
    @InjectRepository(Ciudadano)
    private repository: Repository<Ciudadano>
  ) {}

  async create(data: CreateCiudadanoInput): Promise<Ciudadano> {
    // ciudadanos do not provide passwords; persist provided fields as-is
    const register = this.repository.create(data as unknown as Ciudadano);
    return await this.repository.save(register as Ciudadano);
  }

  async findAll(): Promise<Ciudadano[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<Ciudadano[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_ciudadano: 'ASC'},
    });
  }

  async findOne(id_ciudadano: number): Promise<Ciudadano> {
    return await this.repository.findOneBy({id_ciudadano});
  }

  async update(id_ciudadano: number, data: UpdateCiudadanoInput): Promise<Ciudadano> {
    data.id_ciudadano = id_ciudadano;
    // no password handling for ciudadanos
    const register = await this.repository.preload(data);
    if (!register) {
      throw new NotFoundException(`Not found id_ciudadano: ${id_ciudadano}`);
    }
    return await this.repository.save(register);
  }

  async remove(id_ciudadano: number): Promise<boolean> {
    const result = await this.repository.delete({id_ciudadano});
    return result.affected ? result.affected > 0 : false;
  }
}
