import db from '../db.js'; // Importation de ton client connecté à Turso

// Initialisation de la table des livres (Persistance des données dans le Cloud)
export async function initBooksDb() {
    try {
        // db.execute remplace db.exec
        await db.execute(`
            CREATE TABLE IF NOT EXISTS livres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titre TEXT NOT NULL,
                auteur TEXT NOT NULL,
                domaine TEXT NOT NULL,
                faculte TEXT NOT NULL,
                description TEXT,
                url_livre TEXT NOT NULL,
                url_couverture TEXT,
                date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log(" Base de données des livres connectée et sécurisée sur le Cloud Turso.");
    } catch (error) {
        console.error("Erreur d'initialisation de la table livres :", error);
    }
}

export const Book = {
    // Enregistrer un nouvel ouvrage
    async create(titre, auteur, domaine, faculte, description, url_livre, url_couverture) {
        // db.execute remplace db.run
        return db.execute({
            sql: 'INSERT INTO livres (titre, auteur, domaine, faculte, description, url_livre, url_couverture) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [titre, auteur, domaine, faculte, description, url_livre, url_couverture]
        });
    },
    
    // Récupérer les livres par faculté (pour les étudiants)
    async getByFaculte(faculte) {
        // db.execute remplace db.all
        const resultat = await db.execute({
            sql: 'SELECT * FROM livres WHERE faculte = ? ORDER BY date_ajout DESC',
            args: [faculte]
        });
        // Turso encapsule les lignes de données dans la propriété .rows
        return resultat.rows; 
    },

    // Récupérer tout le catalogue (pour l'administration)
    async getAll() {
        const resultat = await db.execute('SELECT * FROM livres ORDER BY date_ajout DESC');
        return resultat.rows; 
    },
    
    // Supprimer un ouvrage
    async delete(id) {
        return db.execute({
            sql: 'DELETE FROM livres WHERE id = ?',
            args: [id]
        });
    }
};