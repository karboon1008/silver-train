export async function registerForNotifications() {
  return {
    ok: false as const,
    reason: 'not-connected' as const,
    token: null,
  };
}
