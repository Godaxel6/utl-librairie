import express from 'express';
import { Book } from '../models/books.js';

const router = express.Router();

// 1. Ajouter
router.post('/ajouter', async (req, res) => {
    console.log(" Nouvel ouvrage reçu du frontend :", req.body);
    const { titre, auteur, domaine, faculte, description, url_livre, url_couverture } = req.body;
    
    if (!titre || !auteur || !domaine || !faculte || !url_livre) {
        return res.status(400).json({ erreur: "Champs obligatoires manquants." });
    }

    try {
        await Book.create(titre, auteur, domaine, faculte, description, url_livre, url_couverture);
        res.status(201).json({ message: "Livre référencé avec succès !" });
    } catch (error) {
        console.error("❌ Erreur SQL :", error.message);
        res.status(500).json({ erreur: "Erreur base de données." });
    }
});

// 2. Récupérer par faculté
router.get('/faculte/:nomFaculte', async (req, res) => {
    try {
        const livres = await Book.getByFaculte(req.params.nomFaculte);
        res.status(200).json(livres);
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

// 3. Voir tout le catalogue
router.get('/tous', async (req, res) => {
    try {
        const livres = await Book.getAll();
        res.status(200).json(livres);
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

// 4. SUPPRIMER (C'est cette partie qui gère l'effacement)
router.delete('/supprimer/:id', async (req, res) => {
    try {
        await Book.delete(req.params.id);
        console.log(` Livre ID ${req.params.id} supprimé.`);
        res.status(200).json({ message: "Lien supprimé." });
    } catch (error) {
        console.error(" Erreur suppression :", error.message);
        res.status(500).json({ erreur: "Erreur serveur lors de la suppression." });
    }
});

export default router;