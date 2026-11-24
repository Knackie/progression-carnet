# 🏸 Carnet de Progression - Quick Start

## ⚡ 5 minutes pour démarrer

### Étape 1: Préparer Supabase (2 min)

1. Aller sur [supabase.com](https://supabase.com) → "Sign up" → Créer un compte
2. Créer un nouveau projet (nom: `progression-carnet`)
3. Attendre ~1 minute que le projet se crée
4. Aller dans **Settings** → **API**
5. Copier:
   - `Project URL`
   - `Anon Public Key`

### Étape 2: Setup SQL (1 min)

1. Dans Supabase, aller dans **SQL Editor**
2. Cliquer "New query"
3. Copier-coller [ce SQL](./SUPABASE_SETUP.md) → Run

### Étape 3: Configurer l'app (1 min)

1. Dans le dossier du projet:
   ```bash
   cp .env.local.example .env.local
   ```

2. Ouvrir `.env.local` avec un éditeur
3. Remplacer les valeurs:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxyyyzzz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Étape 4: Lancer (1 min)

```bash
npm install
npm run dev
```

Ouvrir: http://localhost:3000

---

## 🎯 Première utilisation

1. **S'inscrire** avec email et mot de passe
2. **Vérifier votre email** (clic sur le lien Supabase)
3. Se connecter
4. Créer votre première entrée:
   - Sport: Badminton
   - Type: Match
   - Ajouter une note libre
   - Lister 3 points forts, 3 faibles, etc.
   - Score: 7/10
5. ✅ Entrée créée ! Voir dans "Dernières entrées"

---

## 📊 Voir les graphiques

Les graphiques apparaissent automatiquement quand vous avez au moins 2 entrées sur différents mois.

---

## ⚙️ Troubleshooting rapide

| Problème | Solution |
|----------|----------|
| "Erreur Supabase" | Vérifier `.env.local` (pas d'espaces) |
| "Pas d'email" | Vérifier spam, ou relancer inscription |
| "Pas de graphiques" | Besoin 2+ entrées sur mois différents |
| Erreur sur le build | `rm -rf node_modules && npm install` |

---

## 🚀 Prochaines étapes

- [ ] Lire [SETUP.md](./SETUP.md) pour plus de détails
- [ ] Voir [ROADMAP.md](./ROADMAP.md) pour les futures features
- [ ] Créer quelques entrées pour tester
- [ ] Partager avec vos amis!

---

## 📱 PWA (Installer comme app)

L'app est installable! Sur Chrome/Edge:
1. Cliquer sur l'icône "+" en haut à droite
2. "Installer Carnet de Progression"
3. ✅ App installée sur votre appareil

---

## 💬 Support

Problème? Vérifier:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Config détaillée
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Next.js](https://nextjs.org/docs)

---

Bon développement! 🎉
