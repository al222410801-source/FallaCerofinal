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
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'andres12',
      database: 'FallaCero',
      synchronize: true,
      autoLoadEntities: true,
    }),
    FallaCeroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
