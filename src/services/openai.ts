export async function generateTrip() {
  return { ok: false as const, reason: 'not-connected' as const };
}

export async function suggestStops() {
  return { ok: false as const, reason: 'not-connected' as const };
}
