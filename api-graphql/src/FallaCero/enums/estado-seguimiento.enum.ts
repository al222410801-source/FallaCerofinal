import {registerEnumType} from '@nestjs/graphql';

export enum EstadoSeguimiento {
  RECIBIDO = 'RECIBIDO',
  EN_REVISION = 'EN_REVISION',
  ASIGNADO = 'ASIGNADO',
  EN_PROCESO = 'EN_PROCESO',
  RESUELTO = 'RESUELTO',
  CERRADO = 'CERRADO',
  RECHAZADO = 'RECHAZADO',
}

registerEnumType(EstadoSeguimiento, {
  name: 'EstadoSeguimiento',
  description: 'Estados por los que puede pasar el seguimiento de una denuncia',
});
