import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importation de tes routes et bases de données
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import booksRoutes from './routes/books.js';
import { initDb } from './models/users.js';
import { initBooksDb } from './models/books.js';

// Configuration pour gérer les chemins de fichiers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//CONFIGURATION DE SÉCURITÉ ET LECTURE 
app.use(cors());
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  CABLAGE DES ROUTES 
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/admin', adminRoutes); // LA ROUTE ADMIN EST MAINTENANT CONNECTÉE

//DÉMARRAGE DU MOTEUR 
const PORT = 5001;

async function demarrerServeur() {
    try {
        await initDb();
        await initBooksDb();
        
        app.listen(PORT, () => {
            console.log(`Serveur UTL Library en ligne sur le port ${PORT}`);
            console.log(`En attente des requêtes...`);
        });
    } catch (error) {
        console.error(" Erreur critique au démarrage :", error);
    }
}

demarrerServeur();