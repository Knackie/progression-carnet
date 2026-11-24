# 🛠️ Améliorations rapides pour le MVP

## Bugs/Issues à corriger

### 1. Validation du formulaire
**Priorité**: MOYENNE
**Effort**: 30 min

Actuellement, le formulaire accepte des valeurs vides. À faire:
- Minimum 1 point fort rempli
- Minimum 1 point faible rempli
- Minimum 1 axe de progression rempli
- Notes optionnelles mais bienvenues

**Fichier**: `components/EntryForm.tsx`

---

### 2. Gestion des erreurs réseau
**Priorité**: MOYENNE
**Effort**: 20 min

Les erreurs Supabase ne sont pas toujours claires. À faire:
- Messages d'erreur plus explicites
- Retry automatique pour timeouts
- Toast notifications au lieu d'alertes

**Fichier**: `components/EntryForm.tsx`, `app/dashboard/page.tsx`

---

### 3. Loading states
**Priorité**: BASSE
**Effort**: 15 min

L'UX loading est minimale. À faire:
- Skeleton screens en attente de données
- Spinner animé pendant chargement
- Message "Pas de données" vs "Chargement..."

**Fichier**: `app/dashboard/page.tsx`

---

## Features rapides à ajouter

### 1. Lister toutes les entrées
**Priorité**: HAUTE
**Effort**: 1-2 heures

Créer une page `/entries` avec:
- Affichage de toutes les entrées paginées
- Filtrer par sport
- Filtrer par date (7 jours, mois, année)
- Bouton supprimer
- Cliquer pour voir les détails

**Fichiers à créer**:
- `app/entries/page.tsx`
- `app/entries/[id]/page.tsx`
- `components/EntriesList.tsx`

---

### 2. Éditer une entrée
**Priorité**: HAUTE
**Effort**: 1-2 heures

Permettre la modification:
- Clicker "Edit" sur une entrée
- Pre-remplir le formulaire
- Faire les modifications
- Sauvegarder les changes

**Fichiers à modifier**:
- `components/EntryForm.tsx` (ajouter mode edit)
- `lib/supabase.ts` (ajouter fonction update)

---

### 3. Supprimer une entrée
**Priorité**: MOYENNE
**Effort**: 20 min

Ajouter un bouton supprimer:
- Avec confirmation
- Avec undo optionnel (soft delete)

**Fichiers à modifier**:
- `components/EntryForm.tsx`
- `lib/supabase.ts` (ajouter fonction delete)

---

### 4. Profil utilisateur
**Priorité**: BASSE
**Effort**: 1 heure

Créer une page `/profile` avec:
- Email de l'utilisateur
- Date de création du compte
- Nombre total d'entrées
- Statistiques personnelles
- Bouton "Supprimer mon compte"

**Fichiers à créer**:
- `app/profile/page.tsx`

---

### 5. Mode sombre
**Priorité**: BASSE
**Effort**: 1 heure

Ajouter un toggle dark mode:
- Avec `next-themes`
- Persister la préférence
- Appliquer aux graphiques aussi

**Fichiers à modifier**:
- `app/layout.tsx`
- `components/` (tous)

---

## Optimisations

### 1. Lazy loading des graphiques
**Priorité**: BASSE
**Effort**: 30 min

Les graphiques peuvent ralentir sur beaucoup de données:
- Charger seulement les 12 derniers mois
- Pagination des mois

---

### 2. Caching des données
**Priorité**: BASSE
**Effort**: 1 heure

Utiliser React Query pour cacher les données:
- `npm install @tanstack/react-query`
- Éviter rechargements inutiles
- Background refresh

---

### 3. Image optimization
**Priorité**: TRÈS BASSE
**Effort**: 15 min

Optimiser les emojis/images:
- Utiliser icônes SVG au lieu d'emojis
- Lazy load les images

---

## Code quality

### 1. Tests unitaires
**Priorité**: MOYENNE
**Effort**: 2-3 heures

Ajouter Jest + React Testing Library:
```bash
npm install --save-dev jest @testing-library/react
```

Tester:
- `components/EntryForm.tsx`
- `lib/supabase.ts`

---

### 2. E2E tests
**Priorité**: BASSE
**Effort**: 2-3 heures

Ajouter Playwright:
```bash
npm install --save-dev @playwright/test
```

Scénarios:
- Signup → Créer entrée → Logout
- Login → Voir graphiques

---

### 3. Linting stricter
**Priorité**: BASSE
**Effort**: 1 heure

Améliorer ESLint config:
- Ajouter règles strictes
- Prettier pour formatting

---

## Documentation

### 1. Vidéo de démonstration
**Priorité**: MOYENNE
**Effort**: 30 min

Créer une vidéo de 2-3 min:
- Signup
- Créer une entrée
- Voir les graphiques
- Uploader sur GitHub

---

### 2. Tutoriels vidéo
**Priorité**: BASSE
**Effort**: 1 heure

Créer:
- Setup Supabase en vidéo
- Déploiement sur Vercel

---

## Sécurité

### 1. Rate limiting
**Priorité**: BASSE
**Effort**: 1 heure

Limiter les API calls:
- Max 100 req/min par IP
- Supabase a du rate limiting natif

---

### 2. Input sanitization
**Priorité**: BASSE
**Effort**: 30 min

Nettoyer les inputs:
- Pas de XSS
- Pas de SQL injection (OK avec Supabase)
- Utiliser zod pour validation

---

## Performance

### 1. Code splitting
**Priorité**: BASSE
**Effort**: 30 min

Lazy load les routes:
```typescript
const Dashboard = dynamic(() => import('./dashboard'), { ssr: false });
```

---

### 2. Image optimization
**Priorité**: TRÈS BASSE
**Effort**: 15 min

Utiliser Next.js Image component

---

## Priority de développement

**Semaine 1 (Urgent):**
1. ✅ MVP fonctionnel (fait)
2. Lister toutes les entrées
3. Éditer une entrée

**Semaine 2:**
4. Supprimer une entrée
5. Validation amélioriée
6. Meilleure gestion des erreurs

**Semaine 3:**
7. Tests unitaires
8. Déploiement Vercel
9. Vidéo de démo

**Plus tard:**
10. Dark mode
11. Profil utilisateur
12. E2E tests

---

## Checklist avant déploiement

- [ ] Env vars configurées sur Supabase
- [ ] Env vars configurées sur Vercel
- [ ] Pas de console.log() en production
- [ ] Linting passe
- [ ] Tests passent
- [ ] PWA fonctionne offline
- [ ] Mobile responsive OK
- [ ] Performance > 90 (Lighthouse)

---

## Resources utiles

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Best Practices](https://nextjs.org/docs)
- [React Patterns](https://react.dev)
- [Tailwind Examples](https://tailwindui.com)
- [Recharts Gallery](https://recharts.org)

---

**Note**: Cette liste est vivante. À jour au 2026-11-24.
