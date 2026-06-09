import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// Charge les variables secrètes de ton fichier .env
dotenv.config();

// Création du client connecté à Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// On exporte directement l'objet 'db' prêt à l'emploi
export default db;