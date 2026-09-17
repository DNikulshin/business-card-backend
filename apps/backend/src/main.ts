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

  const displayHost = host === '0.0.0.0' ? 'localhost' : host;
  logger.log(`Application running in ${nodeEnv} mode`);
  logger.log(`GraphQL Playground: http://${displayHost}:${port}/graphql`);
  logger.log(`Health check: http://${displayHost}:${port}/health`);
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('Shutdown');
  logger.error('Fatal error during startup', error);
  process.exit(1);
});
