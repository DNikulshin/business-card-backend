import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module.js';
import { AppConfig } from './shared/config.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const configService = app.get<ConfigService<AppConfig>>(ConfigService);

  const nodeEnv = configService.getOrThrow('nodeEnv', { infer: true });
  const port = configService.getOrThrow('port', { infer: true });
  const host = configService.getOrThrow('host', { infer: true });

  await app.listen(port, host);

  logger.log(`[bootstrap] Сервер запущен в режиме: ${nodeEnv.toUpperCase()}`);
  logger.log(
    `[bootstrap] GraphQL API доступен по адресу: http://localhost:${port}/graphql`,
  );
}

bootstrap().catch((err) => {
  const logger = new Logger('Shutdown');
  logger.error('Critical error during application bootstrap:', err);
  process.exit(1);
});
