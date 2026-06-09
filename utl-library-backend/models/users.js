import db from '../db.js'; // Ton client Turso

// La fonction d'initialisation (désormais asynchrone)
export const initDb = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS utilisateurs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom_complet TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        mot_de_passe_hash TEXT NOT NULL,
        chemin_carte TEXT NOT NULL,
        role TEXT NOT NULL,
        statut TEXT NOT NULL
      )
    `);
    console.log(" Table 'utilisateurs' connectée et sécurisée sur Turso.");
  } catch (error) {
    console.error(" Erreur d'initialisation de la table utilisateurs :", error);
  }
};

export const User = {
  create: async (nom_complet, email, mot_de_passe_hash, chemin_carte, role, statut) => {
    const resultat = await db.execute({
      sql: `INSERT INTO utilisateurs (nom_complet, email, mot_de_passe_hash, chemin_carte, role, statut) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [nom_complet, email, mot_de_passe_hash, chemin_carte, role, statut]
    });
    // Equivalent de ton ancien this.lastID
    return resultat.lastInsertRowid; 
  },

  findByEmail: async (email) => {
    const resultat = await db.execute({
      sql: `SELECT * FROM utilisateurs WHERE email = ?`,
      args: [email]
    });
    // Equivalent de ton ancien db.get() : on retourne la première ligne trouvée
    return resultat.rows[0]; 
  },

  getPending: async () => {
    const resultat = await db.execute(`SELECT * FROM utilisateurs WHERE statut = 'pending'`);
    // Equivalent de ton ancien db.all()
    return resultat.rows; 
  },

  updateStatus: async (id, statut) => {
    const resultat = await db.execute({
      sql: `UPDATE utilisateurs SET statut = ? WHERE id = ?`,
      args: [statut, id]
    });
    // Equivalent de ton ancien this.changes
    return resultat.rowsAffected; 
  }
};