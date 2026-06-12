import { useState, useEffect } from 'react';

//DONNÉES DU CATALOGUE (Domaines et Facultés complétées avec Culture Générale)
const baseAcademique = [
  { id: 'd1', nom: "Sciences et Technologie", facultes: ["Architecture", "Mines et géologie", "Pétrole et gaz", "Sciences informatiques", "Réseaux informatiques", "Intelligence artificielle (IA)"] },
  { id: 'd2', nom: "Sciences Agronomiques et Environnement", facultes: ["Techniques agricoles", "Sciences agronomiques", "Gestion des ressources", "Naturelles renouvelables", "Agroéconomie"] },
  { id: 'd3', nom: "Sciences de la Santé", facultes: ["Sciences infirmières", "Sage femme"] },
  { id: 'd4', nom: "Sciences Appliquées", facultes: ["Mines", "Chimies", "Électromécanique", "Métallurgies", "Génie civil", "Génie électrique"] },
  { id: 'd5', nom: "Sciences Juridiques, Éco, Homme, Société & Arts", facultes: ["Droit", "Sciences économiques", "Sciences de l'information et de la communication (SIC)", "Criminologie", "Modélisme", "Techniques d'habillement", "Esthétique"] },
  // AJOUT DE TON NOUVEAU DOMAINE HORS FACULTÉ
  { id: 'd6',  nom: "Culture générale", facultes: ["Histoire", "Psychologie", "Philosophie", "Sociologie", "Littérature"] }
];

// COMPOSANT 1 : PAGE D'ACCUEIL
function PageAccueil({ onSuivant }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <header className="border-b bg-white sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2"><h1 className="text-2xl font-bold text-gray-950 tracking-tight">UTL<span className="text-orange-500">LIBRARY</span></h1></div>
          <button onClick={onSuivant} className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition shadow-sm">Espace Membre</button>
        </nav>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 bg-gray-900 text-white font-medium rounded-full text-xs tracking-wider uppercase">Réseau d'agrégation littéraire</span>
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-950 leading-tight">Accédez au savoir.<br/><span className="text-orange-500 italic">Sans limites.</span></h2>
            <p className="text-xl text-gray-700 max-w-lg leading-relaxed">Une infrastructure documentaire centralisant les meilleures ressources libres mondiales pour concevoir l'avenir.</p>
            <div className="pt-4"><button onClick={onSuivant} className="group flex items-center gap-3 px-8 py-4 bg-gray-950 text-white text-lg font-bold rounded-xl hover:bg-orange-500 transition-all duration-300 shadow-lg">Initialiser la session <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg></button></div>
          </div>
          <div className="relative">
            <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-60"></div>
            {/* CORRECTION : h-[450px] sans espace pour Tailwind CSS */}
            <img src="/page1.jpeg" alt="Lecture" className="relative z-10 rounded-3xl shadow-2xl object-cover w-full h-[450px]" loading="lazy" />
          </div>
        </div>
      </main>
      <footer className="border-t py-6 bg-gray-100 text-center text-sm text-gray-500">&copy; UTL Library. Architecture Cloud.</footer>
    </div>
  );
}

// COMPOSANT 2 : PAGE D'AUTHENTIFICATION 
// COMPOSANT 2 : PAGE D'AUTHENTIFICATION 
function PageAuth({ onRetour, onConnexionReussie }) {
  const [vueActuelle, setVueActuelle] = useState('register');
  
  const handleInscription = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/inscription', { method: 'POST', body: new FormData(e.currentTarget) });
      if (response.ok) { 
        // Redirection directe sans alerte JS
        setVueActuelle('pending'); 
      } 
      else { alert("Erreur : " + (await response.json()).erreur); }
    } catch { alert("Serveur injoignable."); }
  };
  
  const handleConnexion = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await fetch('http://localhost:5001/api/auth/connexion', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const resData = await response.json();
      
      if (response.ok) {
        onConnexionReussie(resData.role);
      }
      else if (response.status === 403 && resData.statut === 'en_attente') {
        // Redirection directe sans alerte JS
        setVueActuelle('pending');
      }
      else {
        alert(resData.erreur || resData.message);
      }
    } catch { alert("Serveur injoignable."); }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))) });
      const data = await response.json();
      if (response.ok) { alert(" " + data.message); setVueActuelle('login'); } else alert(" Erreur : " + data.erreur);
    } catch { alert("Serveur injoignable."); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <button onClick={onRetour} className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-orange-500">← Retour</button>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        
        {/* CORRECTION FINALE : L'image est placée directement comme élément et s'ajuste parfaitement */}
        <img src="/image-login.jpeg" alt="Illustration" className="hidden md:block md:w-1/2 object-cover" loading="lazy" />
        
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          
          {vueActuelle === 'register' && (
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Rejoindre la bibliothèque</h2>
              <form onSubmit={handleInscription} className="space-y-4">
                <input name="nom" type="text" placeholder="Nom complet" required className="w-full p-2.5 border rounded-lg" />
                <input name="email" type="email" placeholder="Email" required className="w-full p-2.5 border rounded-lg" />
                <input name="mot_de_passe" type="password" placeholder="Mot de passe (8+ car, 1 Maj, 1 Chiffre)" required minLength="8" className="w-full p-2.5 border rounded-lg" />
                <div className="p-4 border-2 border-dashed rounded-xl bg-orange-50/50"><label className="block text-sm font-medium mb-2"> Carte d'étudiant</label><input name="carte_etudiant" type="file" accept="image/*" required className="w-full text-sm" /></div>
                <button type="submit" className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition">S'inscrire</button>
              </form>
              <p className="mt-5 text-center text-sm">Déjà inscrit ? <button onClick={() => setVueActuelle('login')} className="text-orange-600 font-bold hover:underline">Se connecter</button></p>
            </div>
          )}
          
          {vueActuelle === 'login' && (
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Bon retour !</h2>
              <form onSubmit={handleConnexion} className="space-y-4">
                <input name="email" type="email" placeholder="Email" required className="w-full p-2.5 border rounded-lg" />
                <input name="mot_de_passe" type="password" placeholder="Mot de passe" required className="w-full p-2.5 border rounded-lg" />
                <button type="submit" className="w-full py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition">Connexion</button>
              </form>
              <div className="mt-5 text-center space-y-2 text-sm">
                <p><button onClick={() => setVueActuelle('reset')} className="text-gray-500 hover:text-orange-500 transition">Mot de passe oublié ?</button></p>
                <p className="border-t pt-3">Pas encore de compte ? <button onClick={() => setVueActuelle('register')} className="text-orange-600 font-bold hover:underline">S'inscrire</button></p>
              </div>
            </div>
          )}
          
          {vueActuelle === 'reset' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Réinitialisation</h2>
              <p className="text-gray-500 mb-6 text-sm">Entrez l'adresse email associée à votre compte.</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input name="email" type="email" placeholder="Votre email" required className="w-full p-2.5 border rounded-lg" />
                <input name="nouveau_mot_de_passe" type="password" placeholder="Nouveau mot de passe" required minLength="8" className="w-full p-2.5 border rounded-lg" />
                <button type="submit" className="w-full py-3 bg-gray-950 text-white font-bold rounded-lg hover:bg-orange-500 transition">Mettre à jour le mot de passe</button>
              </form>
              <p className="mt-5 text-center text-sm"><button onClick={() => setVueActuelle('login')} className="text-gray-500 hover:text-gray-800 transition">← Retour</button></p>
            </div>
          )}
          
          {vueActuelle === 'pending' && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Validation en cours</h2>
              <p className="text-gray-600 mb-8 font-medium">Veuillez revenir plus tard, l'administrateur vérifie votre carte.</p>
              <button onClick={() => setVueActuelle('login')} className="py-2.5 px-8 bg-gray-950 text-white rounded-full hover:bg-orange-500 transition">Retour à la connexion</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
//COMPOSANT 3 : LE CATALOGUE (Avec affichage en grille style "Netflix")
function PageCatalogue({ onDeconnexion }) {
  const [domaineActif, setDomaineActif] = useState(null);
  const [faculteActive, setFaculteActive] = useState(null);
  const [livres, setLivres] = useState([]);
  const [chargement, setChargement] = useState(false);

  // 1. LA CORRECTION DE LA PAGE BLANCHE EST ICI 
  useEffect(() => {
    if (faculteActive) {
      setChargement(true);
      fetch(`http://localhost:5001/api/books/faculte/${encodeURIComponent(faculteActive)}`)
        .then(res => res.json())
        .then(data => { 
            // Sécurité : on vérifie que data est bien un tableau (Array)
            setLivres(Array.isArray(data) ? data : []); 
            setChargement(false); 
        })
        .catch(() => {
            setLivres([]); // Sécurité absolue en cas d'erreur serveur
            setChargement(false);
        });
    } else setLivres([]);
  }, [faculteActive]);

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-950">UTL<span className="text-orange-500">LIBRARY</span></h1>
          <button onClick={onDeconnexion} className="text-sm font-medium text-gray-500 hover:text-red-500 transition">Déconnexion</button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500">
          <button onClick={() => { setDomaineActif(null); setFaculteActive(null); }} className={`hover:text-orange-500 transition ${!domaineActif ? "text-orange-500 font-bold" : ""}`}>Domaines</button>
          {domaineActif && <><span>/</span><button onClick={() => setFaculteActive(null)} className={`hover:text-orange-500 transition ${!faculteActive ? "text-orange-500 font-bold" : ""}`}>{domaineActif.nom}</button></>}
          {faculteActive && <><span>/</span><span className="text-gray-800 font-bold">{faculteActive}</span></>}
        </div>

        {!domaineActif && (
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Espace des Savoirs</h2>
            <p className="text-gray-500 mb-8">Sélectionnez votre univers d'étude ou de lecture pour accéder aux ressources.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {baseAcademique.map((domaine) => (
                <button key={domaine.id} onClick={() => setDomaineActif(domaine)} className="group flex items-center gap-6 p-6 bg-gray-50 border border-gray-200 rounded-xl hover:shadow-md hover:border-orange-200 transition-all text-left">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{domaine.icone}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{domaine.nom}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {domaine.nom === "Culture générale" ? `${domaine.facultes.length} rubriques` : `${domaine.facultes.length} facultés`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {domaineActif && !faculteActive && (
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{domaineActif.nom}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {domaineActif.facultes.map((faculte, index) => (
                <button key={index} onClick={() => setFaculteActive(faculte)} className="flex items-center justify-between p-5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all group">
                  <span className="font-semibold text-gray-700 group-hover:text-orange-700 text-left">{faculte}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-orange-500 transition-colors" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {faculteActive && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Bibliothèque</h2>
                <p className="text-gray-500 text-lg">
                  {domaineActif.nom === "Culture générale" ? "Catégorie : " : "Faculté : "}<span className="font-semibold text-gray-700">{faculteActive}</span>
                </p>
              </div>
              <span className="text-gray-500 font-medium">{livres.length} résultat(s)</span>
            </div>

            {chargement ? (
              <div className="text-center py-20"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-500">Recherche...</p></div>
            ) : livres.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center"><div className="text-5xl mb-4">📭</div><h3 className="text-xl font-bold text-gray-800 mb-2">Aucun ouvrage</h3></div>
            ) : (
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {livres.map((livre) => (
                  <a 
                    key={livre.id} 
                    href={livre.url_livre} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block relative group transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-lg overflow-hidden bg-gray-100"
                  >
                    {livre.url_couverture ? (
                      // 2. LA CORRECTION LAZY LOADING EST ICI 
                      <img 
                        src={livre.url_couverture} 
                        alt={livre.titre} 
                        title={`${livre.titre} - ${livre.auteur}`} 
                        className="w-full h-full object-cover aspect-[2/3]"
                        loading="lazy"
                      />
                    ) : (
                      <div 
                        title={`${livre.titre} - ${livre.auteur}`}
                        className="w-full h-full aspect-[2/3] bg-gradient-to-tr from-indigo-900 to-slate-700 flex flex-col items-center justify-center p-4 text-center relative"
                      >
                        <span className="text-white font-serif font-bold text-sm leading-snug">{livre.titre}</span>
                        <span className="text-gray-300 text-xs mt-2 italic">{livre.auteur}</span>
                      </div>
                    )}
                  </a>
                ))}
              </div>
              
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// COMPOSANT 4 : LE PANNEAU ADMINISTRATEUR 
function PageAdmin({ onRetour }) {
  const [etudiants, setEtudiants] = useState([]);
  const [tousLesLivres, setTousLesLivres] = useState([]); 
  const [ongletActif, setOngletActif] = useState('etudiants'); 
  const [domaineSelectionne, setDomaineSelectionne] = useState('');
  const [messageUpload, setMessageUpload] = useState('');

  const chargerDonnees = async () => {
    try {
      const resEtu = await fetch('http://localhost:5001/api/admin/pending'); 
      if (resEtu.ok) setEtudiants(await resEtu.json());

      const resLivres = await fetch('http://localhost:5001/api/books/tous'); 
      if (resLivres.ok) {
        setTousLesLivres(await resLivres.json());
      }
    } catch (error) { 
      console.error("Erreur de connexion au serveur :", error); 
    }
  };

  useEffect(() => { 
    chargerDonnees(); 
  }, []);

  const traiterDemande = async (id, decision) => {
    const response = await fetch(`http://localhost:5001/api/admin/validate/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ status: decision }) 
    });
    if (response.ok) chargerDonnees();
  };
  
  const supprimerLivre = async (id) => {
    if (window.confirm("Supprimer définitivement ce livre ?")) {
      try {
        const response = await fetch(`http://localhost:5001/api/books/supprimer/${id}`, { method: 'DELETE' });
        if (response.ok) { alert("Livre supprimé !"); chargerDonnees(); } 
        else { alert("Erreur serveur."); }
      } catch (error) { alert("Serveur injoignable."); }
    }
  };

  // --- SOUMISSION DU FORMULAIRE ---
  const handleAjoutLivre = async (e) => {
    e.preventDefault(); 
    setMessageUpload('Ajout en cours... ⏳');
    
    const formData = new FormData(e.currentTarget);
    const donneesLivre = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:5001/api/books/ajouter', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donneesLivre) 
        });
        if (response.ok) { 
            setMessageUpload(' Livre ajouté au catalogue !'); 
            e.target.reset(); 
            setDomaineSelectionne(''); 
            chargerDonnees();
            setTimeout(() => setMessageUpload(''), 3000); 
        } else { 
            setMessageUpload(' Erreur lors de l\'ajout.'); 
        }
    } catch (error) {
        setMessageUpload(' Serveur injoignable.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-orange-500"> Panel Admin</h1>
            <button onClick={onRetour} className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition">Déconnexion</button>
        </div>
        
        {/* LA BARRE D'ONGLETS ORIGINALE */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-700 pb-4">
          <button onClick={() => setOngletActif('etudiants')} className={`px-6 py-2 rounded-lg font-bold ${ongletActif === 'etudiants' ? 'bg-orange-500' : 'bg-gray-800'}`}>Étudiants ({etudiants.length})</button>
          
          <button onClick={() => setOngletActif('ajouter')} className={`px-6 py-2 rounded-lg font-bold ${ongletActif === 'ajouter' ? 'bg-orange-500' : 'bg-gray-800'}`}>Ajouter un Livre</button>
          
          <button onClick={() => setOngletActif('catalogue')} className={`px-6 py-2 rounded-lg font-bold ${ongletActif === 'catalogue' ? 'bg-orange-500' : 'bg-gray-800'}`}>
            Gérer le Catalogue ({tousLesLivres.length})
          </button>
        </div>

        {/* ONGLET 1 : ÉTUDIANTS */}
        {ongletActif === 'etudiants' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {etudiants.length === 0 ? (<p className="col-span-3 text-center py-20 text-gray-500 italic">Aucune carte à valider.</p>) : (
                etudiants.map(etu => (
                <div key={etu.id} className="bg-gray-800 rounded-xl p-4 border border-gray-700"><img src={`http://localhost:5001/${etu.chemin_carte.replace('\\', '/')}`} className="h-56 w-full object-contain bg-gray-950 rounded mb-4 p-1" alt="Carte" /><h3 className="font-bold">{etu.nom_complet}</h3><p className="text-xs text-gray-400 mb-4">{etu.email}</p><div className="flex gap-2"><button onClick={() => traiterDemande(etu.id, 'rejected')} className="flex-1 py-1 bg-red-500/20 text-red-500 rounded text-sm hover:bg-red-500 hover:text-white transition">Refuser</button><button onClick={() => traiterDemande(etu.id, 'approved')} className="flex-1 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition">Valider</button></div></div>
                ))
            )}
          </div>
        )}

        {/* ONGLET : AJOUTER UN LIVRE MANUELLEMENT */}
        {ongletActif === 'ajouter' && (
           <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-2xl mx-auto">
             
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><span></span> Référencer un ouvrage en ligne</h2>
             
             <form onSubmit={handleAjoutLivre} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input name="titre" type="text" placeholder="Titre du livre" required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-orange-500" />
                    <input name="auteur" type="text" placeholder="Auteur" required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-orange-500" />
                </div>
                
                <textarea name="description" placeholder="Courte description ou résumé du livre..." rows="4" className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-orange-500 text-sm leading-relaxed"></textarea>

                <select name="domaine" value={domaineSelectionne} onChange={(e) => setDomaineSelectionne(e.target.value)} required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-orange-500">
                  <option value="" disabled>-- Sélectionner un domaine --</option>
                  {baseAcademique.map(d => <option key={d.id} value={d.nom}>{d.nom}</option>)}
                </select>
                {domaineSelectionne && (
                  <select name="faculte" required className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg outline-none focus:border-orange-500">
                    <option value="" disabled selected>-- Sélectionner une faculté / catégorie --</option>
                    {baseAcademique.find(d => d.nom === domaineSelectionne)?.facultes.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                )}

                <div className="space-y-3 pt-2">
                    <div>
                        <label className="text-xs text-gray-400 font-bold uppercase ml-1">Lien vers le livre (Obligatoire)</label>
                        <input name="url_livre" type="url" placeholder="https://..." required className="w-full mt-1 p-3 bg-gray-950 border border-gray-600 rounded-lg outline-none focus:border-orange-500 text-sm" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 font-bold uppercase ml-1">Image de couverture (Optionnel)</label>
                        <input name="url_couverture" type="url" placeholder="https://..." className="w-full mt-1 p-3 bg-gray-950 border border-gray-600 rounded-lg outline-none focus:border-orange-500 text-sm" />
                    </div>
                </div>

                <button type="submit" className="w-full mt-4 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg text-lg">Publier dans la base</button>
                {messageUpload && <div className="text-center font-bold text-green-400 p-3 bg-green-500/20 rounded-lg border border-green-500/30">{messageUpload}</div>}
             </form>
           </div>
        )}

        {/* ONGLET : CATALOGUE */}
        {ongletActif === 'catalogue' && (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            {tousLesLivres.length === 0 ? (
                <p className="text-center py-10 text-gray-500 italic">Le catalogue est vide.</p>
            ) : (
                <table className="w-full text-left">
                <thead className="bg-gray-900 text-gray-400 text-sm uppercase">
                    <tr>
                        <th className="p-4">Titre & Auteur</th>
                        <th className="p-4">Faculté / Rubrique</th>
                        <th className="p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {tousLesLivres.map(livre => (
                    <tr key={livre.id} className="hover:bg-gray-750 transition">
                        <td className="p-4">
                            <div className="font-bold text-white flex items-center gap-2">
                                {livre.url_couverture && <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>}
                                {livre.titre}
                            </div>
                            <div className="text-xs text-gray-500">{livre.auteur}</div>
                        </td>
                        <td className="p-4 text-sm text-gray-400">{livre.faculte}</td>
                        <td className="p-4 text-right">
                            <button onClick={() => supprimerLivre(livre.id)} className="p-2 px-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition text-sm font-bold">
                                 Supprimer
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function App() {
  const [pageActuelle, setPageActuelle] = useState('home');
  return (
    <>
      {pageActuelle === 'home' && <PageAccueil onSuivant={() => setPageActuelle('auth')} />}
      {pageActuelle === 'auth' && <PageAuth onRetour={() => setPageActuelle('home')} onConnexionReussie={(role) => setPageActuelle(role === 'admin' ? 'admin' : 'catalog')} />}
      {pageActuelle === 'catalog' && <PageCatalogue onDeconnexion={() => setPageActuelle('home')} />}
      {pageActuelle === 'admin' && <PageAdmin onRetour={() => setPageActuelle('home')} />}
    </>
  );
}