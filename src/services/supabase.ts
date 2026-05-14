import { getPublicEnv } from '@/config/env';

type AuthSuccess = { ok: true; user: { name: string; email: string } };
type AuthFailure = { ok: false; error: string };
export type AuthResult = AuthSuccess | AuthFailure;

export async function signInWithEmail(
  email: string,
  _password: string,
): Promise<AuthResult> {
  if (!getPublicEnv().expoPublicSupabaseUrl) {
    return { ok: true, user: { name: 'Ava Traveler', email } };
  }
  // Real path: install @supabase/supabase-js, init client, then:
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password: _password });
  // if (error) return { ok: false, error: error.message };
  // return { ok: true, user: { name: data.user.user_metadata?.name ?? 'Traveler', email } };
  return { ok: true, user: { name: 'Ava Traveler', email } };
}

export async function signUpWithEmail(
  name: string,
  email: string,
  _password: string,
): Promise<AuthResult> {
  if (!getPublicEnv().expoPublicSupabaseUrl) {
    return { ok: true, user: { name, email } };
  }
  // Real path: await supabase.auth.signUp({ email, password: _password, options: { data: { name } } });
  return { ok: true, user: { name, email } };
}

export function getSupabaseClient() {
  return null;
}
