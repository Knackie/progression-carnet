// Supabase Auth returns English messages; show French ones to users.
const MESSAGES: [RegExp, string][] = [
  [/invalid login credentials/i, 'Email ou mot de passe incorrect'],
  [/email not confirmed/i, 'Email pas encore confirmé : vérifiez votre boîte mail'],
  [/user already registered|already been registered/i, 'Un compte existe déjà avec cet email'],
  [/password should be at least (\d+)/i, 'Le mot de passe doit contenir au moins $1 caractères'],
  [/unable to validate email|invalid format|email address .* is invalid/i, 'Adresse email invalide'],
  [/rate limit|too many requests|security purposes/i, 'Trop de tentatives, réessayez dans quelques minutes'],
];

export function translateAuthError(message: string): string {
  for (const [pattern, french] of MESSAGES) {
    const match = message.match(pattern);
    if (match) return french.replace('$1', match[1] ?? '');
  }
  return message;
}
