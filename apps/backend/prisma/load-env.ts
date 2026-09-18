import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rootEnv = path.resolve(__dirname, '../../../.env');

const localEnv = path.resolve(__dirname, '../.env');

config({ path: rootEnv });

config({ path: localEnv, override: true });
