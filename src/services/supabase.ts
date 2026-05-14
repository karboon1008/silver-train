export function getSupabaseClient() {
  return null;
}

export async function signInWithEmail(email: string, _password: string) {
  return { ok: true as const, user: { name: 'Ava Traveler', email } };
}

export async function signUpWithEmail(name: string, email: string, _password: string) {
  return { ok: true as const, user: { name, email } };
}
