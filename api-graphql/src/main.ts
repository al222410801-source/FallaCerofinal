import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {json, urlencoded} from 'body-parser';

const capabibara = async () => {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => callback(null, origin),
    credentials: true,
  });
  app.use(json({limit: "100mb"}));

  app.use(urlencoded({limit: '100mb', extended: true}));

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  console.log(`Starting Nest app - effective PORT=${port}`);
  await app.listen(port);
}

capabibara();
