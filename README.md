# 🏸 Carnet de Progression

Journal de progression pour le badminton et les échecs : après chaque match ou entraînement, on note ses impressions, 3 points forts, 3 points faibles et 3 axes de progression, puis on suit son évolution dans le temps.

**En ligne :** https://progression-carnet.vercel.app

## Fonctionnalités

- Connexion par email (Supabase Auth)
- Entrées match / entraînement, modifiables et supprimables
- Pour les matchs : note sur 10, résultat (victoire / défaite, + nulle aux échecs) et classement de l'adversaire (NC, P12 → N1 au badminton)
- Graphique de progression et page d'analyse (points récurrents, taux de victoire)
- Profil joueur avec classement actuel et prochain palier
- Mode sombre
- [Politique de confidentialité](./app/confidentialite/page.tsx), notamment pour les noms d'adversaires
- Installable sur téléphone (Android : menu Chrome > « Installer l'application » ; iPhone : Safari > Partager > « Sur l'écran d'accueil »)

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Recharts · Supabase (Postgres + Auth + RLS) · Vercel

## Lancer en local

1. `npm install`
2. Créer `.env.local` :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. Dans Supabase > SQL Editor, exécuter [supabase/setup.sql](./supabase/setup.sql). Le script peut être relancé sans risque après chaque mise à jour.
4. `npm run dev`, puis ouvrir http://localhost:3000

## Déploiement

Chaque push sur `main` est déployé automatiquement sur Vercel. Les deux variables d'environnement ci-dessus doivent être définies dans le projet Vercel.

## Structure

```
app/
  api/entries/          CRUD des entrées + stats
  api/player-profile/   profil joueur
  auth/                 connexion / inscription
  dashboard/            tableau de bord + analyse
  profile/              profil joueur
  info/                 crédits
  confidentialite/      politique de confidentialité
components/             formulaires, liste, graphique, profil
lib/                    types, classements, thème
supabase/setup.sql      schéma, RLS, vues
```

## Sécurité

Toutes les routes API transmettent le token de l'utilisateur à Supabase. La Row Level Security garantit que chacun ne lit et ne modifie que ses propres données. Aucune clé `service_role` n'est utilisée.
