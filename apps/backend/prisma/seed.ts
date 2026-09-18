import './load-env.js';
import { PrismaClient } from '#prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { pathToFileURL } from 'node:url';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Please provide a connection string to run migrations or seed.',
  );
}

export async function seedProfile(prisma: PrismaClient) {
  const profileData = {
    name: 'Никульшин Дмитрий Юрьевич',
    description:
      'Fullstack-разработчик (Node.js/NestJS, TypeScript, React, PostgreSQL). Проектирую и разрабатываю масштабируемые веб-сервисы, REST/GraphQL API и распределенные системы от архитектуры до деплоя.',
    github: 'https://github.com/DNikulshin',
    linkedin: null,
    portfolio: 'https://dnikulshin.github.io',
  };

  const skillsData = [
    { name: 'TypeScript' },
    { name: 'JavaScript' },
    { name: 'NestJS' },
    { name: 'React' },
    { name: 'GraphQL' },
    { name: 'Prisma' },
    { name: 'Docker' },
    { name: 'PostgreSQL' },
  ];

  const experiencesData = [
    {
      company:
        'Независимая разработка (фриланс / собственные коммерческие проекты)',
      position: 'Fullstack-разработчик',
      period: 'Декабрь 2024 — настоящее время',
      achievements:
        'Спроектировал и реализовал комплексные production-решения: realtime-система мониторинга транспорта (WebSocket, React PWA, React Native), CRM-платформы управления задачами и клиентами (NestJS + Next.js + Prisma + PostgreSQL), сервисы фонового парсинга и сбора данных (Playwright, BullMQ), поисково-аналитические сервисы (FastAPI, pgvector). Полный цикл: архитектура, API, UI, CI/CD и контейнеризация.',
    },
    {
      company: 'ООО "Связь Стандарт"',
      position: 'Fullstack-разработчик (React / Node.js / Express)',
      period: 'Июль 2023 — Декабрь 2024',
      achievements:
        'Разработал PWA «Helpdesk» с нуля для внутренних нужд компании (React + Redux Toolkit, Node.js/Express, PostgreSQL, WebSocket). Интегрировал картографические сервисы для отображения заявок. Внедрил систему уведомлений и ролевую модель доступа (RBAC). Сократил время обработки заявок на 30% за счёт автоматизации маршрутизации.',
    },
  ];

  const projectsData = [
    {
      name: 'Система мониторинга корпоративного транспорта',
      url: 'https://github.com/DNikulshin/corporate-transport',
    },
    {
      name: 'CRM-система поддержки (helpdesk)',
      url: 'https://github.com/DNikulshin/support-ticketing-system',
    },
    {
      name: 'CRM-система управления задачами',
      url: 'https://github.com/DNikulshin/task-management-crm',
    },
    {
      name: 'Сервис автоматизации сбора заявок (scan-agent)',
      url: 'https://github.com/DNikulshin/scan-agent',
    },
    {
      name: 'DocBrain — система поиска и классификации документов',
      url: 'https://github.com/DNikulshin/docbrain',
    },
    {
      name: 'Automation Starter — шаблоны интеграций и воркеров',
      url: 'https://github.com/DNikulshin/ai-automation-starter',
    },
    {
      name: 'AnyWhereDesk — self-hosted сервис удалённого доступа',
      url: 'https://github.com/DNikulshin/AnyWhereDesk',
    },
    {
      name: 'pc-remote — фоновый сервис системного мониторинга',
      url: 'https://github.com/DNikulshin/pc-remote',
    },
  ];

  return prisma.$transaction(async (tx) => {
    const profile = await tx.profile.upsert({
      where: { id: 1 },
      update: profileData,
      create: {
        id: 1,
        ...profileData,
      },
    });

    await tx.skill.deleteMany({ where: { profileId: 1 } });
    await tx.skill.createMany({
      data: skillsData.map((s) => ({ ...s, profileId: 1 })),
    });

    await tx.experience.deleteMany({ where: { profileId: 1 } });
    await tx.experience.createMany({
      data: experiencesData.map((e) => ({ ...e, profileId: 1 })),
    });

    await tx.project.deleteMany({ where: { profileId: 1 } });
    await tx.project.createMany({
      data: projectsData.map((p) => ({ ...p, profileId: 1 })),
    });

    return profile;
  });
}

async function main() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const result = await seedProfile(prisma);
    console.log(`Profile successfully synchronized: ${result.name}`);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
