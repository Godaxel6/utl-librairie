import express from 'express';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { User } from '../models/users.js'; 

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, './uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_')); }
});
const upload = multer({ storage });

// --- 1. ROUTE : INSCRIPTION ---
router.post('/inscription', upload.single('carte_etudiant'), async (req, res) => {
    const { nom, email, mot_de_passe } = req.body;
    const file = req.file;

    if (!nom || !email || !mot_de_passe || !file) {
        return res.status(400).json({ erreur: "Tous les champs et la carte sont requis." });
    }

    const regexMdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
    if (!regexMdp.test(mot_de_passe)) {
        return res.status(400).json({ erreur: "Mot de passe trop faible (8 car, 1 Maj, 1 chiffre)." });
    }

    try {
        const hash = await bcrypt.hash(mot_de_passe, 10);
        
        let role = 'etudiant';
        let statut = 'pending'; // CORRECTION ICI
        
        if (email === 'levraisksima@gmail.com') { // METS TON EMAIL ICI
            role = 'admin';
            statut = 'valide';
        }

        await User.create(nom, email, hash, file.path, role, statut); 
        
        res.status(201).json({ message: role === 'admin' ? "Compte Admin créé !" : "Inscription réussie." });
    } catch (error) {
        if (error.message && error.message.includes('UNIQUE')) {
            return res.status(400).json({ erreur: "Cet email est déjà utilisé." });
        }
        res.status(500).json({ erreur: "Erreur lors de l'inscription." });
    }
});

// --- 2. ROUTE : CONNEXION ---
router.post('/connexion', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ erreur: "Email et mot de passe requis." });
    }

    try {
        const utilisateur = await User.findByEmail(email);
        if (!utilisateur) return res.status(401).json({ erreur: "Identifiants incorrects." });

        const mdpValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe_hash);
        if (!mdpValide) return res.status(401).json({ erreur: "Identifiants incorrects." });

        const statut = utilisateur.statut;
        
        if (statut === 'pending') { // CORRECTION ICI
            return res.status(403).json({ statut: "en_attente", message: "Carte en cours de validation." });
        } else if (statut === 'rejected') {
            return res.status(403).json({ statut: "rejete", message: "Inscription rejetée." });
        } else if (statut === 'approved' || statut === 'valide') {
            return res.status(200).json({ 
                statut: "valide",
                role: utilisateur.role,
                utilisateur: { id: utilisateur.id, nom: utilisateur.nom_complet, email: utilisateur.email }
            });
        }
    } catch (error) {
        res.status(500).json({ erreur: "Erreur serveur." });
    }
});

// --- 3. ROUTE : RÉINITIALISATION MOT DE PASSE ---
router.post('/reset-password', async (req, res) => {
    const { email, nouveau_mot_de_passe } = req.body;

    if (!email || !nouveau_mot_de_passe) {
        return res.status(400).json({ erreur: "L'email et le nouveau mot de passe sont requis." });
    }

    const regexMdp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
    if (!regexMdp.test(nouveau_mot_de_passe)) {
        return res.status(400).json({ erreur: "Mot de passe trop faible (8 car, 1 Maj, 1 chiffre minimum)." });
    }

    try {
        const utilisateur = await User.findByEmail(email);
        if (!utilisateur) {
            return res.status(404).json({ erreur: "Aucun compte trouvé avec cette adresse email." });
        }

        const hash = await bcrypt.hash(nouveau_mot_de_passe, 10);
        await User.updatePassword(email, hash);
        
        res.status(200).json({ message: "Votre mot de passe a été réinitialisé avec succès !" });
    } catch (error) {
        res.status(500).json({ erreur: "Erreur lors de la réinitialisation." });
    }
});

export default router;