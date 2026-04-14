import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import {join} from 'path';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GraphQLDate} from 'graphql-scalars';
import { FallaCeroModule } from './FallaCero/fallaCero.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      buildSchemaOptions: {
        scalarsMap: [
          {type: Date, scalar: GraphQLDate},
        ],
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db.utvt.cloud',
      port: 5432,
      username: 'fallacero',
      password: 'WB&0dp043NZp',
      database: 'db_fallacero',
      synchronize: true,
      autoLoadEntities: true,
    }),
    FallaCeroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
