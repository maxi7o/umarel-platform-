
import { config } from 'dotenv';
import path from 'path';

// Load .env.local
config({ path: path.resolve(__dirname, '../.env.local') });
