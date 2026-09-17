import http from 'node:http';

const PORT = Number(process.env.BACKEND_PROD_PORT || 3000);
const HEALTH_URL = `http://localhost:${PORT}/health`;

console.log('\nWaiting for backend service to be ready...');

const checkHealth = (attempts = 35) => {
  http
    .get(HEALTH_URL, (res) => {
      if (res.statusCode === 200) {
        console.log(`
Deployment complete. Service is running.

Endpoints:
- Apollo Sandbox: http://localhost:${PORT}/graphql
- Health Check:   http://localhost:${PORT}/health

Monitoring:
- View logs:      pnpm logs
        `);
        process.exit(0);
      } else {
        retry(attempts);
      }
    })
    .on('error', () => retry(attempts));
};

const retry = (attempts) => {
  if (attempts <= 0) {
    console.error('\nError: service failed to start in time. Check logs: pnpm logs\n');
    process.exit(1);
  }
  process.stdout.write('.');
  setTimeout(() => checkHealth(attempts - 1), 1000);
};

checkHealth();
