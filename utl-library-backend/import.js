import fs from 'fs';
import { Book, initBooksDb } from './models/books.js';

async function importerLivres() {
    try {
        // 1. S'assurer que la base est prête
        await initBooksDb();

        // 2. Lire le fichier JSON
        const rawData = fs.readFileSync('./livres.json', 'utf-8');
        const livres = JSON.parse(rawData);

        console.log(`\n Lancement de l'importation de ${livres.length} ouvrages...\n`);

        // 3. Injecter chaque livre un par un
        for (const livre of livres) {
            await Book.create(
                livre.titre,
                livre.auteur,
                livre.domaine,
                livre.faculte,
                livre.description,
                livre.url_livre,
                livre.url_couverture
            );
            console.log(` Injecté : ${livre.titre}`);
        }

        console.log("\n Opération terminée ! Tu peux relancer ton serveur.");
        process.exit(0); // Ferme le script proprement
    } catch (error) {
        console.error("\nErreur fatale lors de l'importation :", error);
        process.exit(1);
    }
}

importerLivres();