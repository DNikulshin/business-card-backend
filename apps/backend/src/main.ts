import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module.js';
import { AppConfig } from './shared/config.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const configService = app.get(ConfigService<AppConfig, true>);

  const nodeEnv = configService.getOrThrow<string>('nodeEnv', { infer: true });
  const port = configService.getOrThrow<number>('port', { infer: true });
  const host = configService.getOrThrow<string>('host', { infer: true });

  await app.listen(port, host);

  logger.log(
    `[bootstrap] Application running in ${nodeEnv.toUpperCase()} mode`,
  );
  logger.log(
    `[bootstrap] GraphQL Playground available at: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/graphql`,
  );
  logger.log(
    `[bootstrap] Health endpoint available at: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/health`,
  );
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('Shutdown');
  logger.error('Fatal error encountered during application bootstrap:', error);
  process.exit(1);
});
