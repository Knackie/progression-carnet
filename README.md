# 🏸 Carnet de Progression - Suivi personnel et outil d'analyse

**Application web pour suivre votre progression au badminton et aux échecs.**

> Journal personnel + Analyse structurée + Graphiques de progression

## ⚡ 5 minutes pour démarrer

📚 **Lire d'abord**: [QUICKSTART.md](./QUICKSTART.md)

```bash
# 1. Cloner
git clone https://github.com/Knackie/progression-carnet
cd progression-carnet

# 2. Installer & Setup
npm install
# Créer projet Supabase → .env.local → SQL

# 3. Lancer
npm run dev
# → http://localhost:3000
```

---

## 🎯 Qu'est-ce que c'est?

Un **carnet numérique pour progresser dans les sports**. Après chaque match ou entraînement, vous pouvez:

✅ **Écrire librement** - Vos impressions, ressentis  
✅ **Analyser structurellement** - 3 points forts + 3 faibles + erreurs + 3 axes  
✅ **Scorer votre session** - 0 à 10  
✅ **Visualiser la progression** - Graphiques mensuels  
✅ **Suivre plusieurs sports** - Badminton, Échecs (+ Tennis, Tennis de table bientôt)

---

## 🚀 Features

### Core
- ✅ Authentification email (Supabase)
- ✅ Créer/voir des entrées (Match/Entraînement)
- ✅ Journal personnel (notes libres)
- ✅ Analyse guidée (3 points forts, 3 faibles, erreurs, 3 axes de progression)
- ✅ Scoring 0-10
- ✅ Graphiques de progression mensuels
- ✅ Support Badminton + Échecs

### UX/Design
- ✅ Responsive (mobile/desktop)
- ✅ Modern design avec Tailwind
- ✅ PWA installable
- ✅ Dark mode support

### Sécurité
- ✅ Auth email sécurisée
- ✅ Row Level Security (Supabase)
- ✅ Chacun ne voit que ses données

---

## 📱 Screenshots

**Accueil**
```
┌─────────────────────────────┐
│   🏸 Carnet de Progression  │
│  Analysez votre progression │
│    [S'inscrire] [Se login]  │
│                             │
│  📝 Journal personnel       │
│  📊 Analyse structurée      │
│  📈 Visualisez progression  │
│  🎯 Sports supportés        │
└─────────────────────────────┘
```

**Dashboard**
```
┌──────────────────────────────────────┐
│ 📝 Formulaire d'entrée               │
│ [Sport] [Type] [Date] [Score]        │
│ Notes libres                         │
│ 3 Points forts / 3 Faibles / ...     │
│ [Créer]                              │
│                                      │
│ 📈 Graphiques                        │
│ ┌─────────────────────────┐          │
│ │ Entrées par mois        │          │
│ │  █ █ █                  │          │
│ └─────────────────────────┘          │
│ ┌─────────────────────────┐          │
│ │ Score moyen par mois    │          │
│ │  ╱╲    ╱╲                │          │
│ └─────────────────────────┘          │
│                                      │
│ 📋 Dernières entrées                 │
│ ┌─────────────────────────┐          │
│ │ 🏸 Badminton - Match    │ 7/10    │
│ │ 2024-11-24 • Forces: ..│          │
│ └─────────────────────────┘          │
└──────────────────────────────────────┘
```

---

## 📚 Documentation

| Document | Sujet | Temps |
|----------|-------|-------|
| **[QUICKSTART.md](./QUICKSTART.md)** | ⭐ Démarrer | 5 min |
| **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** | Config Supabase | 10 min |
| **[SETUP.md](./SETUP.md)** | Installation complète | 15 min |
| **[PLAN.md](./PLAN.md)** | Vue d'ensemble | 10 min |
| **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Résumé visuel | 5 min |
| **[ROADMAP.md](./ROADMAP.md)** | Futures features | 15 min |
| **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** | Améliorations | 15 min |

👉 **[Lire l'index complet →](./README.md)**

---

## 🛠️ Stack technologique

**Frontend**
- Next.js 15 (Framework React)
- React 19 (UI)
- TypeScript (Typage)
- Tailwind CSS (Styling)
- Recharts (Graphiques)

**Backend**
- Supabase (Auth + PostgreSQL)
- Row Level Security

**DevOps**
- Vercel (Déploiement recommandé)
- GitHub (Repository)

---

## 🎯 Workflow utilisateur

```
Visiteur
   ↓ [S'inscrire avec email]
Confirmation email
   ↓ [Vérifier lien]
Utilisateur connecté
   ↓ [Créer entrée]
Entrée sauvegardée
   ↓ [Voir graphiques]
Progression visualisée
   ↓ [Continuer à tracker]
Évolution visible
```

---

## 📊 Base de données

**Table**: `progression_entries`

```sql
id              UUID
user_id         UUID (FK)
sport           'badminton' | 'chess'
date            DATE
entry_type      'match' | 'training'
notes           TEXT
strengths       TEXT[] (3 points forts)
weaknesses      TEXT[] (3 points faibles)
errors          TEXT[] (Erreurs)
improvement_axes TEXT[] (3 axes)
score           0-10
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

Row Level Security: Chacun ne voit que ses données

---

## 🔄 Architecture

```
┌─────────────────────────────────┐
│   Browser (Next.js Client)      │
│  - React components             │
│  - Forms & Graphs               │
└──────────────┬──────────────────┘
               │
        [API Calls]
               │
┌──────────────▼──────────────────┐
│   Supabase (Backend)            │
│  - Auth (Email)                 │
│  - Database (PostgreSQL)        │
│  - Row Level Security           │
└─────────────────────────────────┘
```

---

## 🚀 Déploiement

### Option 1: Vercel (Recommandé)

```bash
npm i -g vercel
vercel
# → Ajouter env vars dans le dashboard
```

### Option 2: Autre serveur

```bash
npm run build
npm run start
```

---

## 🧪 En développement

```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Lancer production
npm run lint     # Vérifier code
```

---

## 🤝 Contribution

Les PRs sont bienvenues! Pour contribuer:

1. Fork le repo
2. Lire [ROADMAP.md](./ROADMAP.md) et [IMPROVEMENTS.md](./IMPROVEMENTS.md)
3. Choisir un item
4. Créer branche `feature/xxx`
5. Coder
6. Faire PR vers `main`

---

## 📋 Roadmap

**v1.0** ✅ MVP (fait!)
- Authentification
- Créer entrées
- Graphiques

**v1.1** (Prochainement)
- Éditer/supprimer entrées
- Lister toutes les entrées
- Mode sombre

**v2.0** (Moyen terme)
- Tennis + Tennis de table
- Statistiques avancées
- Export PDF

**v3.0** (Long terme)
- App mobile
- Coaching personnel
- Partage de progressions

👉 **[Lire complet →](./ROADMAP.md)**

---

## ✨ Statut

- **Version**: 1.0.0 (MVP)
- **Status**: ✅ **Production-Ready**
- **Date**: 2026-11-24
- **Développeur**: [@Knackie](https://github.com/Knackie)

---

## 📞 Support

**Besoin d'aide?**

- 📚 Lire [QUICKSTART.md](./QUICKSTART.md) (5 min)
- 🔧 Lire [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) si bloqué
- 💡 Lire [PLAN.md](./PLAN.md) pour comprendre
- 🚀 Lire [IMPROVEMENTS.md](./IMPROVEMENTS.md) pour développer

---

## 📄 License

MIT

---

**Bon développement et bonne progression! 🏸**

Créé avec ❤️ pour tracker votre évolution sportive

