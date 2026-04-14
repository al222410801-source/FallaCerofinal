import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FallaCeroResolver} from './fallaCero.resolver';
import {
  Ciudadano,
  Usuario,
  TipoUsuario,
  Denuncia,
  Evidencia,
  DetEvidencia,
  HistorialEstado,
  ServidorPublico
} from './entities';
import {
  CiudadanoService,
  UsuarioService,
  TipoUsuarioService,
  DenunciaService,
  EvidenciaService,
  DetEvidenciaService,
  HistorialEstadoService,
  ServidorPublicoService
} from './services';
import {
  CiudadanoResolver,
  UsuarioResolver,
  TipoUsuarioResolver,
  DenunciaResolver,
  EvidenciaResolver,
  DetEvidenciaResolver,
  HistorialEstadoResolver,
  ServidorPublicoResolver
} from './resolvers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ciudadano,
      Usuario,
      TipoUsuario,
      Denuncia,
      Evidencia,
      DetEvidencia,
      HistorialEstado,
      ServidorPublico
    ]),
  ],
  providers: [
    FallaCeroResolver,
    CiudadanoResolver,
    CiudadanoService,
    UsuarioResolver,
    UsuarioService,
    TipoUsuarioResolver,
    TipoUsuarioService,
    DenunciaResolver,
    DenunciaService,
    EvidenciaResolver,
    EvidenciaService,
    DetEvidenciaResolver,
    DetEvidenciaService,
    HistorialEstadoResolver,
    HistorialEstadoService,
    ServidorPublicoResolver,
    ServidorPublicoService
  ],
})
export class FallaCeroModule {}
