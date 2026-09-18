import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module.js';
import { ProfileService } from '../features/profile/profile.service.js';

describe('GraphQL E2E (AppModule)', () => {
  let app: INestApplication;

  const mockProfile = {
    id: 1,
    name: 'Никульшин Дмитрий Юрьевич',
    description: 'Fullstack-разработчик',
    github: 'https://github.com/DNikulshin',
    linkedin: null,
    portfolio: 'https://dnikulshin.github.io',
    skills: [{ id: 1, name: 'TypeScript' }],
    experiences: [
      {
        id: 1,
        company: 'Tech Corp',
        position: 'Developer',
        period: '2024',
        achievements: 'Launched project',
      },
    ],
    projects: [
      {
        id: 1,
        name: 'corporate-transport',
        url: 'https://github.com/DNikulshin/corporate-transport',
      },
    ],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProfileService)
      .useValue({
        getProfile: () => Promise.resolve(mockProfile),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves health check via HTTP GET', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('resolves profile query with nested relations over GraphQL POST /graphql', async () => {
    const query = `
      query GetProfile {
        profile {
          name
          description
          skills {
            name
          }
          experience {
            company
            position
          }
          projects {
            name
            url
          }
        }
      }
    `;

    const res = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query });

    expect(res.status).toBe(200);
    expect(res.body.data.profile).toBeDefined();
    expect(res.body.data.profile.name).toBe('Никульшин Дмитрий Юрьевич');
    expect(res.body.data.profile.skills).toHaveLength(1);
    expect(res.body.data.profile.experience[0].company).toBe('Tech Corp');
  });
});
