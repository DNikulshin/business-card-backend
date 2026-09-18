import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaModule } from '../services/prisma/prisma.module.js';
import { ProfileModule } from '../features/profile/profile.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { config } from '../shared/config.js';
import { DEFAULT_QUERY } from './constants.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
      load: [config],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          document: DEFAULT_QUERY,
          footer: false,
        }),
      ],
      // Отключение csrfPrevention осознанно необходимо для работы встроенного Apollo Sandbox
      csrfPrevention: false,
      introspection: true,
    }),
    PrismaModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
