-- ========================================
-- TROUVER VOTRE USER_ID
-- ========================================

-- Afficher tous les utilisateurs authentifiés
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Afficher seulement votre user (si vous savez votre email)
-- Remplacez 'your@email.com' par votre email
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
WHERE email = 'your@email.com';

-- Afficher le dernier utilisateur créé
SELECT 
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 1;

-- ========================================
-- UTILISER VOTRE USER_ID
-- ========================================
-- Copiez votre user_id (c'est un UUID comme: 12345678-1234-1234-1234-123456789012)
-- Puis remplacez 'YOUR_USER_ID' dans les autres fichiers SQL
