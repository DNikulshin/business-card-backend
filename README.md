# business-card-backend

Backend service providing a GraphQL API for a developer profile, skills, experience, and projects.

## Demo

- **Render (Live Production):** [https://business-card-backend-latest.onrender.com/graphql](https://business-card-backend-latest.onrender.com/graphql)
- **Apollo Sandbox (Self-Hosted):** [https://dev.dnikulshin.ru/proxy/3000/graphql](https://dev.dnikulshin.ru/proxy/3000/graphql)

## Requirements

- Node.js >= 22
- pnpm >= 11
- Docker and Docker Compose

## Quick Start

### Production

Runs the backend and PostgreSQL 16 in isolated Docker containers:

```bash
pnpm prod
```

- Apollo Sandbox: http://localhost:3000/graphql
- Health check: http://localhost:3000/health
- View logs: `pnpm logs`
- Stop containers: `pnpm clean`

### Development

Runs PostgreSQL in Docker on port 5433 and NestJS on the host machine in watch mode on port 3001:

```bash
cp .env.dev.example .env
pnpm dev
```

- Apollo Sandbox: http://localhost:3001/graphql

## GraphQL API

Endpoint: `/graphql`

### Query Example

```graphql
query GetProfile {
  profile {
    name
    description
    github
    linkedin
    portfolio
    skills {
      name
    }
    experience {
      company
      position
      period
      achievements
    }
    projects {
      name
      url
    }
  }
}
```

### cURL Verification

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ profile { name description portfolio skills { name } experience { company position period } projects { name url } } }"}'
```

## Tech Stack

- Monorepo: Node.js 22, pnpm workspaces, Turborepo
- Framework: NestJS 12, GraphQL (Apollo Driver, code-first)
- Database: PostgreSQL 16, Prisma 7 (@prisma/adapter-pg)
- Testing: Vitest (unit tests, coverage report)
- Tooling: oxlint, Prettier, Husky, lint-staged

## Testing

Run unit tests with coverage:

```bash
pnpm test:cov
```

## License

MIT
