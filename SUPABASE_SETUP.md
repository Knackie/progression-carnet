## Configuration Supabase Détaillée

### 1. Créer un compte Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer sur "Sign up" (en haut à droite)
3. S'inscrire avec GitHub ou email
4. Confirmer votre email

### 2. Créer un projet

1. Dans le dashboard, cliquer "New project"
2. Choisir un nom (ex: `progression-carnet`)
3. Choisir une région (ex: `Europe`)
4. Générer un mot de passe fort (sera copié automatiquement)
5. Cliquer "Create new project"

> ⏳ La création prend ~1 minute

### 3. Obtenir vos clés d'API

Une fois le projet créé :

1. Aller dans **Settings** → **API** (menu de gauche)
2. Copier les valeurs :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Créer les tables

1. Aller dans le **SQL Editor** (menu de gauche)
2. Cliquer "New query"
3. Copier-coller ce code SQL :

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

-- Activer Row Level Security
ALTER TABLE progression_entries ENABLE ROW LEVEL SECURITY;

-- Créer les policies
CREATE POLICY "Users can see their own entries" ON progression_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" ON progression_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" ON progression_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" ON progression_entries
  FOR DELETE USING (auth.uid() = user_id);
```

4. Cliquer "Run" ou `Ctrl+Enter`
5. ✅ Les tables sont créées !

### 5. Remplir les variables d'environnement

1. Dans le dossier du projet, créer un fichier `.env.local`
2. Copier ce contenu en remplaçant les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxyyyzzz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 6. Démarrer l'application

```bash
npm run dev
```

Accéder à http://localhost:3000

## Vérification

Une fois l'app lancée :

1. Créer un compte
2. Vérifier votre email (Supabase envoie un lien de confirmation)
3. Créer une première entrée
4. Vérifier que les données apparaissent dans Supabase → **Table Editor** → `progression_entries`

## Dépannage

### Erreur: "Connexion à Supabase impossible"

- Vérifier que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont correctes
- Vérifier qu'il n'y a pas d'espaces ou de sauts à la ligne dans `.env.local`
- Redémarrer le serveur: `npm run dev`

### Erreur: "Permission denied" lors de la création d'entrée

- Vérifier que les **policies** (Row Level Security) sont bien créées
- Aller dans: **Authentication** → **Policies** → vérifier qu'il y a 4 policies pour `progression_entries`

### L'email de confirmation ne reçoit rien

- Vérifier le dossier spam/indésirables
- Aller dans Supabase → **Authentication** → **Email templates** si vous voulez personnaliser les emails

## Support

Pour toute question :
- Lire la [docs Supabase](https://supabase.com/docs)
- Vérifier la [docs Next.js](https://nextjs.org/docs)
