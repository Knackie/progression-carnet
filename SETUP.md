# Carnet de Progression 🏸

Une application web pour suivre votre progression au badminton et aux échecs avec un journal personnel et une analyse structurée.

## Fonctionnalités

- **Journal personnel** : Notez vos impressions et ressentis après chaque match ou entraînement
- **Analyse structurée** : Identifiez 3 points forts, 3 points faibles, vos erreurs et 3 axes de progression
- **Graphiques de progression** : Visualisez votre évolution avec des graphiques par mois
- **Score** : Évaluez chaque session sur 10
- **Support multi-sports** : Badminton et échecs pour commencer
- **Authentification** : Connexion par email avec Supabase
- **PWA** : Application installable sur votre appareil

## Stack technique

- **Frontend** : Next.js 15 + React 19 + Tailwind CSS
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Graphiques** : Recharts
- **Icônes** : Lucide React

## Installation et démarrage

### Prérequis

- Node.js 18+
- Un compte Supabase (gratuit)

### Configuration

1. Cloner le repo
   ```bash
   git clone https://github.com/Knackie/progression-carnet
   cd progression-carnet
   ```

2. Installer les dépendances
   ```bash
   npm install
   ```

3. Créer un projet Supabase :
   - Aller sur [supabase.com](https://supabase.com)
   - Créer un nouveau projet (gratuit)
   - Copier votre `Project URL` et `Anon Public Key`

4. Créer les tables Supabase :
   ```sql
   -- Créer la table progression_entries
   CREATE TABLE progression_entries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID NOT NULL REFERENCES auth.users(id),
     sport TEXT NOT NULL,
     date DATE NOT NULL,
     entry_type TEXT NOT NULL,
     notes TEXT,
     strengths TEXT[] DEFAULT '{}',
     weaknesses TEXT[] DEFAULT '{}',
     errors TEXT[] DEFAULT '{}',
     improvement_axes TEXT[] DEFAULT '{}',
     score INTEGER,
     created_at TIMESTAMP DEFAULT now(),
     updated_at TIMESTAMP DEFAULT now()
   );

   -- Ajouter une politique RLS
   ALTER TABLE progression_entries ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can see their own entries" ON progression_entries
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own entries" ON progression_entries
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update their own entries" ON progression_entries
     FOR UPDATE USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete their own entries" ON progression_entries
     FOR DELETE USING (auth.uid() = user_id);
   ```

5. Créer le fichier `.env.local` :
   ```bash
   cp .env.local.example .env.local
   ```

6. Remplir `.env.local` avec vos clés Supabase :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

7. Lancer l'application
   ```bash
   npm run dev
   ```

   L'application sera disponible à http://localhost:3000

## Utilisation

1. Créer un compte sur la page d'accueil
2. Se connecter avec vos identifiants
3. Sur le dashboard, créer une nouvelle entrée :
   - Sélectionner le sport (badminton ou échecs)
   - Choisir le type (match ou entraînement)
   - Remplir les notes libres
   - Identifier 3 points forts, 3 points faibles, etc.
   - Donner un score de 0 à 10
4. Visualiser votre progression dans les graphiques

## Déploiement

### Sur Vercel (recommandé)

```bash
npm i -g vercel
vercel
```

Suivre les instructions et ajouter vos variables d'environnement dans le dashboard Vercel.

### Sur un autre serveur

```bash
npm run build
npm run start
```

## Roadmap

- [ ] Export des données en CSV/PDF
- [ ] Support tennis et tennis de table
- [ ] Statistiques avancées par sport
- [ ] Partage de fiches avec amis
- [ ] Application mobile native
- [ ] Notifications et rappels

## Licence

MIT

## Auteur

Créé avec ❤️ par [@Knackie](https://github.com/Knackie)
