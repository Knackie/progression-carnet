## Carnet de Progression - Roadmap et Améliorations

### Version 1.0 (MVP actuelle) ✅

**Fonctionnalités:**
- ✅ Authentification par email (Supabase)
- ✅ Création d'entrées (match/entraînement)
- ✅ Journal libre (notes)
- ✅ Analyse guidée (3 points forts, 3 faibles, erreurs, 3 axes de progression)
- ✅ Scoring 0-10
- ✅ Graphiques mensuels (nombre d'entrées, score moyen)
- ✅ Support Badminton + Échecs
- ✅ Dashboard avec dernières entrées

---

### Version 1.1 (Prochainement)

**Lister les entrées détaillées:**
- [ ] Page dédiée pour afficher toutes les entrées
- [ ] Filtrer par sport
- [ ] Filtrer par date (derniers 7 jours, mois, année)
- [ ] Pagination ou scroll infini
- [ ] Supprimer une entrée
- [ ] Modifier une entrée

**Améliorations UX:**
- [ ] Responsive design amélioré
- [ ] Mode sombre
- [ ] Animations de transition
- [ ] Toast notifications (succès/erreur)

---

### Version 2.0 (Court terme)

**Nouveaux sports:**
- [ ] Support Tennis
- [ ] Support Tennis de table
- [ ] Configuration personnalisable par sport (critères spécifiques)

**Statistiques avancées:**
- [ ] Taux de victoires vs défaites
- [ ] Points forts/faibles les plus fréquents
- [ ] Tendances sur 3 mois, 6 mois, 1 an
- [ ] Comparaison match vs entraînement
- [ ] Distribution des scores

**Export de données:**
- [ ] Export CSV
- [ ] Export PDF (fiche de synthèse)
- [ ] Export image (graphiques)

**Partage:**
- [ ] Partager des fiches avec amis (via lien)
- [ ] Voir les progressions d'autres utilisateurs (opt-in)
- [ ] Comparer sa progression avec un ami

---

### Version 2.5 (Moyen terme)

**Features sociales:**
- [ ] Communauté de sportifs
- [ ] Leaderboard par sport
- [ ] Défis (ex: "10 entrées ce mois")
- [ ] Commentaires sur les fiches des amis

**IA/ML:**
- [ ] Suggestions automatiques d'axes de progression
- [ ] Identification de patterns dans les erreurs
- [ ] Prédiction de score avant une session

**Notifications:**
- [ ] Rappel quotidien pour noter une entrée
- [ ] Synthèse hebdomadaire
- [ ] Rappel avant les matchs importants

---

### Version 3.0 (Long terme)

**Application mobile:**
- [ ] App React Native / Flutter
- [ ] Offline-first (sync quand connecté)
- [ ] Camera pour filmer les matchs
- [ ] Localisation GPS

**Intégrations:**
- [ ] Google Calendar (ajouter les matchs au calendrier)
- [ ] Strava (importer les données d'entraînement)
- [ ] Discord/Slack (notifications)

**Premium features:**
- [ ] Coaching personnel (via vidéo)
- [ ] Formations/tutoriels vidéo par sport
- [ ] Plans d'entraînement personnalisés
- [ ] Statistiques illimitées

---

## Architecture - Améliorations techniques

### Base de données
- [ ] Ajouter table `users` pour profils étendus
- [ ] Ajouter table `friends` pour les relations
- [ ] Ajouter table `challenges` pour les défis
- [ ] Indices PostgreSQL pour les recherches rapides

### Frontend
- [ ] Mettre à jour vers Recharts v3
- [ ] Ajouter Framer Motion pour animations
- [ ] Ajouter React Query pour gestion du cache
- [ ] Storybook pour les composants réutilisables

### Backend
- [ ] Edge functions Supabase pour logique complexe
- [ ] Webhooks pour notifications
- [ ] Logs structurés avec Sentry

### DevOps
- [ ] GitHub Actions CI/CD
- [ ] Tests automatisés (Jest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Performance monitoring

---

## Bugs connus / À traiter

- [ ] Validation des formulaires améliorée
- [ ] Gestion des erreurs réseau
- [ ] PWA offline mode
- [ ] SEO optimization

---

## Contribution

Les PRs sont bienvenues ! Pour contribuer :

1. Fork le repo
2. Créer une branche `feature/xxx`
3. Commiter avec messages descriptifs
4. Faire une PR vers `main`

---

## Notes pour le développement

### Conventions de code

**Composants:**
- Utiliser `'use client'` pour les composants avec state/events
- Nommer les fichiers: `PascalCase.tsx`
- Props typescript systématiques

**Fichiers:**
- Utilitaires: `snake_case.ts`
- Routes Next.js: `page.tsx`, `layout.tsx`

**Base de données:**
- Table names: `snake_case`
- Timestamps systématiques: `created_at`, `updated_at`
- UUIDs pour clés primaires
- Row Level Security par défaut

### Checklist avant commit

- [ ] Linting: `npm run lint`
- [ ] Tests passent (si applicable)
- [ ] Pas de console.log() en production
- [ ] Env variables documentées
- [ ] Messages de commit clairs

---

## Questions fréquentes

**Pourquoi Supabase?**
- Gratuit au démarrage
- Authentification built-in
- PostgreSQL = puissant
- Scaling facile

**Pourquoi Next.js?**
- Full-stack (backend + frontend)
- File-based routing simple
- Vercel deployment natif
- TypeScript out-of-the-box

**Peut-on monétiser?**
- Oui, version premium prévue pour v3.0
- Freemium model (entrées limitées, stats avancées, coaching)

---

Dernière mise à jour: 2026-11-24
