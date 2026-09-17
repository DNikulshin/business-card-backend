import { PrismaClient } from '#prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { pathToFileURL } from 'node:url';

export async function seedProfile(prisma: PrismaClient) {
  const existingProfile = await prisma.profile.findFirst();

  if (existingProfile) {
    return null;
  }

  const profile = await prisma.profile.create({
    data: {
      name: 'Никульшин Дмитрий Юрьевич',
      description:
        'Fullstack-разработчик (Middle+) / AI-интегратор. Веду проекты от идеи до продакшна единолично: архитектура, бэкенд (Node.js/NestJS, Python/FastAPI), фронтенд (React/Next.js), инфраструктура и деплой. Фокус — AI-интеграции (LLM, RAG, AI-агенты) и автоматизация бизнес-процессов.',
      github: 'https://github.com/DNikulshin',
      linkedin: null,
      portfolio: 'https://dnikulshin.github.io',
      skills: {
        create: [
          { name: 'TypeScript' },
          { name: 'JavaScript' },
          { name: 'NestJS' },
          { name: 'React' },
          { name: 'GraphQL' },
          { name: 'Prisma' },
          { name: 'Docker' },
          { name: 'PostgreSQL' },
        ],
      },
      experiences: {
        create: [
          {
            company:
              'Независимая разработка (фриланс / собственные продакшн-проекты)',
            position: 'Fullstack-разработчик / AI-интегратор',
            period: 'Декабрь 2024 — настоящее время',
            achievements:
              'Спроектировал и реализовал 8+ production-проектов полного цикла: realtime-система мониторинга транспорта (WebSocket, React PWA, React Native), CRM-системы поддержки и продаж (NestJS + Next.js 15 + Prisma + PostgreSQL), AI-агент для фриланс-бирж (Playwright + LLM), RAG-система для корпоративных документов (FastAPI + LangChain + pgvector). Полный цикл: архитектура → бэкенд → фронтенд → инфраструктура → CI/CD → деплой.',
          },
          {
            company: 'ООО "Связь Стандарт"',
            position: 'Fullstack-разработчик (React / Node.js / Express)',
            period: 'Июль 2023 — Декабрь 2024',
            achievements:
              'Разработал PWA «Helpdesk» с нуля для внутренних нужд компании (React + Redux Toolkit, Node.js/Express, PostgreSQL, WebSocket). Интегрировал Яндекс.Карты для отображения заявок. Внедрил систему уведомлений и ролевую модель доступа. Сократил время обработки заявок на 30% за счёт автоматизации маршрутизации.',
          },
        ],
      },
      projects: {
        create: [
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
            name: 'AI-агент для фриланс-бирж (scan-agent)',
            url: 'https://github.com/DNikulshin/scan-agent',
          },
          {
            name: 'DocBrain — RAG-система для документов',
            url: 'https://github.com/DNikulshin/docbrain',
          },
          {
            name: 'AI Automation Starter',
            url: 'https://github.com/DNikulshin/ai-automation-starter',
          },
          {
            name: 'AnyWhereDesk — self-hosted доступ к рабочим столам',
            url: 'https://github.com/DNikulshin/AnyWhereDesk',
          },
          {
            name: 'pc-remote — агент мониторинга ПК',
            url: 'https://github.com/DNikulshin/pc-remote',
          },
        ],
      },
    },
  });

  return profile;
}

async function main() {
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@127.0.0.1:5433/business_card?schema=public';
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const result = await seedProfile(prisma);

    if (result === null) {
      console.log('[seed] Database already contains profile data. Skipping.');
    } else {
      console.log(`[seed] Profile successfully created: ${result.name}`);
    }
  } catch (error) {
    console.error('[seed] Error populating database:', error);
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
