# Guide de Configuration - Profil Joueur 👤

## Étape 1 : Exécuter la Migration SQL

### Via l'Interface Supabase

1. **Allez dans votre projet Supabase**
   - Visitez https://supabase.com
   - Connectez-vous à votre compte
   - Sélectionnez votre projet "progression-carnet"

2. **Accédez à l'éditeur SQL**
   - Dans le menu de gauche, cliquez sur "SQL Editor"
   - Cliquez sur "New Query"

3. **Collez le code SQL**
   - Ouvrez le fichier `create-player-profiles.sql` du repository
   - Copiez tout le contenu
   - Collez-le dans la fenêtre SQL de Supabase

4. **Exécutez la requête**
   - Cliquez sur le bouton "▶️ Run" (ou Ctrl+Enter)
   - Vérifiez que la requête s'exécute sans erreurs

### Vérification

Après exécution :
1. Allez dans l'onglet "Table Editor"
2. Vous devriez voir une nouvelle table `player_profiles` dans la liste
3. Cliquez sur elle pour vérifier la structure

## Étape 2 : Tester la Fonctionnalité

1. **Allez au dashboard**
   - Connectez-vous à votre application
   - Allez à `/dashboard`

2. **Créez un profil**
   - Scroll down pour trouver la section du profil joueur
   - Cliquez sur "➕ Créer mon profil"
   - Remplissez le formulaire
   - Cliquez sur "💾 Enregistrer le profil"

3. **Vérifiez dans Supabase**
   - Allez dans Supabase > Table Editor
   - Ouvrez la table `player_profiles`
   - Vous devriez voir votre profil enregistré

## Étape 3 : Dépannage

### Erreur: "Table doesn't exist"
- Assurez-vous d'avoir exécuté la migration SQL
- Vérifiez que vous êtes connecté au bon projet Supabase

### Erreur: "Permission denied"
- Vérifiez que les politiques RLS (Row Level Security) ont été créées
- Assurez-vous d'être connecté avec le bon utilisateur

### Erreur: "API retourne 404"
- Assurez-vous que le fichier `app/api/player-profile/route.ts` existe
- Redémarrez le serveur Next.js (npm run dev)

### Le profil ne s'affiche pas
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous d'avoir exécuté la requête SQL avec succès
- Essayez de rafraîchir la page (F5)

## Fichiers Impliqués

### Frontend
- `components/PlayerProfile.tsx` - Composant d'affichage/édition
- `app/dashboard/page.tsx` - Intégration au dashboard
- `lib/types.ts` - Types TypeScript

### Backend
- `app/api/player-profile/route.ts` - Endpoints GET/POST
- `app/api/player-profile/[id]/route.ts` - Endpoints PUT/DELETE

### Database
- `create-player-profiles.sql` - Migration SQL

## Notes de Sécurité

- Les politiques RLS garantissent que chaque utilisateur ne peut voir/modifier que son propre profil
- Les données sont automatiquement associées à votre user_id
- Aucun profil ne peut être accédé par un autre utilisateur

## Prochaines Étapes

1. Personnalisez votre profil joueur
2. Créez des entrées (matches/entraînements)
3. Vérifiez vos statistiques dans la page d'analyse
4. Utilisez votre profil pour contextualiser votre progression
