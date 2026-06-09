import express from 'express';
import { User } from '../models/users.js';

const router = express.Router();

// 1. RÉCUPÉRER LES ÉTUDIANTS EN ATTENTE 
router.get('/pending', async (req, res) => {
    console.log("Requête Admin reçue : Récupération de la liste en attente...");
    try {
        const students = await User.getPending();
        console.log(` Trouvé : ${students.length} étudiant(s) en attente.`);
        res.status(200).json(students);
    } catch (error) {
        console.error("❌ Erreur SQL Admin :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des étudiants." });
    }
});

//  2. VALIDER OU REJETER UN ÉTUDIANT 
router.put('/validate/:id', async (req, res) => {
    const studentId = req.params.id;
    const { status } = req.body; 

    console.log(` Requête Admin reçue : Action '${status}' sur l'étudiant ID ${studentId}`);

    if (status !== 'approved' && status !== 'rejected') {
        return res.status(400).json({ error: "Le statut doit être 'approved' ou 'rejected'." });
    }

    try {
        await User.updateStatus(studentId, status);
        console.log(` Étudiant ID ${studentId} mis à jour avec succès.`);
        res.status(200).json({ message: `L'étudiant a été mis à jour : ${status}` });
    } catch (error) {
        console.error("❌ Erreur SQL Admin validation :", error);
        res.status(500).json({ error: "Impossible de mettre à jour le statut." });
    }
});

export default router;