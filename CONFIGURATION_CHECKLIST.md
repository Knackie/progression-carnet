# ✅ Checklist de Configuration - Carnet de Progression v2.0

Utilisez cette checklist pour vous assurer que tout est correctement configuré.

---

## 🚀 Installation Initiale

### Partie 1: Base de Données (5 minutes)

- [ ] Je suis connecté à [Supabase.com](https://supabase.com)
- [ ] Je suis dans le bon projet ("progression-carnet")
- [ ] J'ai ouvert **SQL Editor** → **New Query**
- [ ] J'ai copié tout le contenu du fichier **`create-player-profiles.sql`**
- [ ] J'ai collé le SQL dans la fenêtre
- [ ] J'ai cliqué **▶️ Run**
- [ ] ✅ La requête s'est exécutée sans erreurs

### Vérification

- [ ] Je vais dans Supabase **Table Editor**
- [ ] Je vois une nouvelle table **`player_profiles`** dans la liste
- [ ] J'ouvre la table pour vérifier qu'elle est vide (c'est normal)

---

## 📱 Configuration de l'App

### Partie 2: Redémarrage & Test

- [ ] J'arrête mon serveur de développement (`Ctrl+C`)
- [ ] Je relance le serveur (`npm run dev`)
- [ ] Je ne vois pas d'erreurs de compilation
- [ ] Je vais sur http://localhost:3000/dashboard
- [ ] ✅ La page charge correctement

---

## 👤 Création du Profil

### Partie 3: Votre Premier Profil

- [ ] Je vois la nouvelle section **"Profil Joueur"** sur le dashboard
- [ ] Je clique sur **"➕ Créer mon profil"**
- [ ] Une modal s'ouvre
- [ ] Je remplis les champs requis:
  - [ ] Prénom
  - [ ] Nom  
  - [ ] Sport
- [ ] Je remplis les champs optionnels (si je veux):
  - [ ] Âge
  - [ ] Style de jeu
  - [ ] Objectif de saison
  - [ ] Points forts (3)
  - [ ] Points faibles (3)
  - [ ] Axes de progression (3)
  - [ ] Biographie
- [ ] Je clique **"💾 Enregistrer le profil"**
- [ ] ✅ Message de succès apparaît

---

## 🔍 Vérification Complète

### Partie 4: Tout Fonctionne?

#### Dashboard
- [ ] Je vois mon profil affichage sur le dashboard
- [ ] Je vois mon nom et ma photo de profil
- [ ] Je peux cliquer **"✏️ Modifier"** pour éditer

#### Édition
- [ ] Je clique sur **"✏️ Modifier"**
- [ ] La modal s'ouvre avec mes données
- [ ] Je peux changer mon style de jeu
- [ ] Je clique **"💾 Enregistrer"**
- [ ] ✅ Les changements sont sauvegardés

#### Supabase
- [ ] Je vais dans Supabase **Table Editor**
- [ ] J'ouvre la table **`player_profiles`**
- [ ] ✅ Je vois mon profil dans la table (1 ligne avec mes données)

---

## 🐛 Test des Bugfixes

### Partie 5: Les Bugs Sont Fixés?

#### Bug #1: Score
- [ ] Je clique sur **"✏️"** pour éditer une entrée (match)
- [ ] Je vois un **slider de score**
- [ ] Je déplace le slider
- [ ] ✅ Le score change immédiatement

#### Bug #2: Données Persistantes
- [ ] J'ouvre une entrée badminton à éditer
- [ ] Je vois ses points forts/faibles
- [ ] Je ferme la modal (**X**)
- [ ] Je clique sur une entrée échecs à éditer
- [ ] ✅ Les points forts/faibles changent correctement

---

## 🎯 Fonctionnalités

### Partie 6: Tout le Site Fonctionne?

#### Entrées
- [ ] Je peux créer une nouvelle entrée (**"➕ Nouvelle Entrée"**)
- [ ] Je peux éditer une entrée (**"✏️"**)
- [ ] Je peux supprimer une entrée (**"🗑️"**)

#### Profil
- [ ] Je peux modifier mon profil (**"✏️ Modifier"**)
- [ ] Je peux voir mes informations affichées
- [ ] Les données sont persistantes après rechargement

#### Dashboard
- [ ] Je vois la courbe de progression
- [ ] Je vois mon profil joueur
- [ ] Je vois mes entrées récentes

#### Page d'Accueil
- [ ] La page d'accueil (/) a un nouveau design
- [ ] Je vois les sections qui expliquent l'app
- [ ] Je peux me connecter/inscrire

---

## 🔐 Sécurité

### Partie 7: Vos Données Sont Sûres?

- [ ] Je suis le seul à pouvoir voir mon profil
- [ ] Je suis le seul à pouvoir éditer mes données
- [ ] Je peux supprimer mon profil si je veux
- [ ] Aucune autre personne ne peut voir mes infos

---

## 📚 Documentation

### Partie 8: Trouvez les Réponses

Lisez la documentation si besoin:

- [ ] **START_HERE_v2.md** - Guide rapide pour utilisateurs
- [ ] **WHATS_NEW.md** - Résumé complet des changements
- [ ] **SETUP_PLAYER_PROFILE.md** - Guide d'installation détaillé
- [ ] **CHANGELOG.md** - Log technique des modifications

---

## ⚠️ Dépannage

Si quelque chose ne fonctionne pas:

### Le profil ne s'affiche pas
- [ ] SQL exécuté? Vérifiez sur Supabase
- [ ] Serveur redémarré? Arrêtez et relancez
- [ ] Console du navigateur? Vérifiez les erreurs (F12)
- [ ] Profil créé? Vérifiez dans Supabase

### "API retourne 404"
- [ ] Vérifiez que `app/api/player-profile/route.ts` existe
- [ ] Vérifiez que le serveur a bien redémarré
- [ ] Vérifiez la console du navigateur (F12 → Console)

### "Permission denied"
- [ ] Les 4 politiques RLS ont-elles été créées?
- [ ] Allez dans Supabase → Authentication → Policies
- [ ] Vous devriez voir 4 politiques sur `player_profiles`

### Le slider du score ne bouge pas
- [ ] ✅ Ce bug est fixé! Vérifiez que vous avez la nouvelle version

---

## 🎉 Bravo!

Si toutes les cases sont cochées:

✅ Votre installation est complète!  
✅ Tous les bugs sont fixés!  
✅ Les nouvelles fonctionnalités marchent!  
✅ Votre profil joueur est opérationnel!

Maintenant:
1. Profitez de votre profil personnalisé
2. Continuez à enregistrer vos entrées
3. Suivez votre progression
4. Atteindez vos objectifs! 🎯

---

## 📞 Besoin d'Aide?

Consultez les fichiers de documentation:
- **START_HERE_v2.md** (Utilisateurs)
- **SETUP_PLAYER_PROFILE.md** (Installation)
- **WHATS_NEW.md** (Résumé complet)

**Dernière mise à jour**: Novembre 2026  
**Version**: 2.0.0
