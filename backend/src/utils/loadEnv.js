import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, '../..');

export const loadEnv = () => {
  const envPath = path.join(backendRoot, '.env');
  const envExamplePath = path.join(backendRoot, '.env.example');

  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    return envPath;
  }

  if (fs.existsSync(envExamplePath)) {
    dotenv.config({ path: envExamplePath });
    return envExamplePath;
  }

  dotenv.config();
  return null;
};
