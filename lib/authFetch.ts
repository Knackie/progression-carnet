// Client-side fetch to our API with the user's token from localStorage.
// On 401 it refreshes the session once and retries. Concurrent callers share
// one refresh: Supabase rotates refresh tokens, and reusing an old one can
// revoke the whole session.

let refreshInFlight: Promise<string | null> | null = null;

export class SessionExpiredError extends Error {
  constructor() {
    super('Session expirée, veuillez vous reconnecter');
  }
}

function readSession(): { access_token?: string; refresh_token?: string } | null {
  try {
    const raw = localStorage.getItem('sb-session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function refreshSession(): Promise<string | null> {
  const session = readSession();
  if (!session?.refresh_token) return null;

  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  if (!response.ok) return null;

  const data = await response.json();
  localStorage.setItem(
    'sb-session',
    JSON.stringify({
      ...session,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    })
  );
  return data.access_token as string;
}

function refreshOnce(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = refreshSession()
      .catch(() => null)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

export async function authFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = readSession()?.access_token;
  if (!token) throw new SessionExpiredError();

  const withToken = (t: string) =>
    fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${t}` } });

  const response = await withToken(token);
  if (response.status !== 401) return response;

  const newToken = await refreshOnce();
  if (!newToken) throw new SessionExpiredError();
  return withToken(newToken);
}
