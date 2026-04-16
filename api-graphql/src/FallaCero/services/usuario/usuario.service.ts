import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Usuario} from 'src/FallaCero/entities';
import {CreateUsuarioInput} from 'src/FallaCero/dtos/usuario/create-usuario.input';
import {UpdateUsuarioInput} from 'src/FallaCero/dtos/usuario/update-usuario.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private repository: Repository<Usuario>
  ) {}

  async create(data: CreateUsuarioInput): Promise<Usuario> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data.password_hash, saltOrRounds);
    const register = {...data, password_hash: hash};
    const new_user = this.repository.create(register);
    return await this.repository.save(new_user);
  }

  async login(data: UpdateUsuarioInput){
    try {
      const user: Usuario = await this.repository.findOneBy({ username: data.username });
      if (!user) return null;
      const match = await bcrypt.compare(data.password_hash, user.password_hash);
      return match ? user : null;
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Usuario[]> {
    return await this.repository.find();
  }

  async findAllPaginate(page: number = 1, limit: number = 10): Promise<Usuario[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      skip,
      take: limit,
      order: {id_usuario: 'ASC'},
    });
  }

  async count(): Promise<number> {
    const totalRow: Array<{count: string}> = await this.repository.query(`SELECT COUNT(*)::text as count FROM usuarios`);
    const total = totalRow && totalRow[0] ? Number(totalRow[0].count) : 0;
    return total;
  }

  async findOne(id_usuario: number): Promise<Usuario> {
    return await this.repository.findOneBy({id_usuario});
  }

  async update(id_usuario: number, data: UpdateUsuarioInput): Promise<Usuario> {
    if (data.password_hash) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(data.password_hash, saltOrRounds);
      data.password_hash = hash;
    }
    const register = await this.repository.preload({
      ...data,
      id_usuario,
    });
    if (!register) {
      throw new NotFoundException(`Not found id_usuario: ${id_usuario}`);
    }
    return await this.repository.save(register);
  }

  async remove(id_usuario: number): Promise<boolean> {
    const result = await this.repository.delete({id_usuario});
    return result.affected ? result.affected > 0 : false;
  }
}
