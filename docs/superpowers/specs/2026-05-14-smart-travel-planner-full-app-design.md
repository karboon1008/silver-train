# Smart Travel Planner — Full App Design

**Date:** 2026-05-14  
**Scope:** Make the app fully functional using local Zustand state, with real-service hooks ready to activate via env keys.

---

## 1. Goals & Constraints

- Every screen must be fully interactive with no dead buttons or stubbed text
- All data lives in Zustand (in-memory); no persistence between restarts until Supabase is wired
- Service layer follows a hybrid pattern: empty env key → mock result; key present → real call; no changes to screens required either way
- Auth forms are Supabase-ready today (real fields, mocked submit)
- OpenAI and Google Places hooks are scaffolded with UI; activate by adding keys to `.env`

---

## 2. Architecture

### 2.1 Store (`src/store/app-store.ts`)

Existing fields (`isAuthenticated`, `themePreference`, `user`) are kept. New fields added:

```ts
trips: TripDetail[]   // TripDetail = { trip: Trip, days: TripDay[] }

addTrip(detail: TripDetail): void
updateTrip(id: string, patch: Partial<Trip>): void
deleteTrip(id: string): void

addStop(tripId: string, dayId: string, stop: Stop): void
removeStop(tripId: string, dayId: string, stopId: string): void
updateRemark(tripId: string, stopId: string, remark: string): void
```

`TripsScreen` maps over `trips.map(d => d.trip)` for list display.

Auth actions gain real signatures:
```ts
signIn(email: string, password: string): Promise<void>
signUp(name: string, email: string, password: string): Promise<void>
signOut(): void
```

Initial `trips` seeds from `[mockTripDetail]` so the app is never empty on first launch.

### 2.2 Service Hybrid Pattern

Each service function checks for its env key at call time. If absent, returns mock data. If present, makes the real call. Screens never branch on this — they call the service and handle the result shape.

**Example — `src/services/supabase.ts`:**
```ts
export async function signInWithEmail(email: string, password: string) {
  if (!getPublicEnv().expoPublicSupabaseUrl) {
    // mock path — always succeeds
    return { ok: true, user: { name: 'Ava Traveler', email } };
  }
  // real path
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { ok: false, error: error.message } : { ok: true, user: data.user };
}
```

Same pattern in `openai.ts` (generateTrip, suggestStops) and `maps.ts` (searchPlaces).

### 2.3 Files Changed

| Action | File | Purpose |
|--------|------|---------|
| MODIFY | `src/store/app-store.ts` | Add trips + stop CRUD + real auth signatures |
| MODIFY | `src/services/supabase.ts` | Real `signInWithEmail` / `signUpWithEmail` functions |
| MODIFY | `src/services/openai.ts` | `suggestStops` returns stub list; real call when key set |
| MODIFY | `src/services/maps.ts` | `searchPlaces` returns filtered mock list; real call when key set |
| MODIFY | `app/(auth)/sign-in.tsx` | Real email + password fields |
| MODIFY | `app/(auth)/sign-up.tsx` | Real name + email + password fields |
| MODIFY | `app/(tabs)/trips/index.tsx` | Reads trips from store; FAB navigates to wizard |
| MODIFY | `app/(tabs)/trips/[id].tsx` | Passes store actions to TripDetailScreen |
| MODIFY | `app/(tabs)/explore.tsx` | Live search filter + category pills + Plan → wizard |
| MODIFY | `src/features/trips/screens/trip-detail.tsx` | Edit sheet, delete, add/remove stop wired to store |
| MODIFY | `src/features/trips/components/stop-card.tsx` | Add rating/hours/admission pills + inline remark |
| MODIFY | `src/mocks/explore.ts` | Expand to 8 destinations across all categories |
| MODIFY | `src/core/constants/routes.ts` | Add `newTrip(destination?)` route |
| NEW | `app/(tabs)/trips/new.tsx` | 3-step trip creation wizard route |
| NEW | `src/features/trips/components/add-stop-sheet.tsx` | Add stop bottom sheet |
| NEW | `src/features/trips/components/edit-trip-sheet.tsx` | Edit trip name/destination/dates sheet |
| NEW | `src/features/auth/components/auth-field.tsx` | Labelled TextInput with error state |

---

## 3. Auth Screens

### Sign In (`app/(auth)/sign-in.tsx`)
- Fields: **Email** (keyboard type `email-address`), **Password** (secureTextEntry)
- Validation: email format, password ≥ 6 chars; inline error below the field
- Submit: calls `signIn(email, password)` from store, which delegates to `signInWithEmail()` service
- Loading: button shows spinner, disabled while in-flight
- Error banner: red banner below button on failure (today: never shown — mock always succeeds)
- Link: "Forgot password?" (no-op today)

### Sign Up (`app/(auth)/sign-up.tsx`)
- Fields: **Name**, **Email**, **Password**
- Same validation + loading + error pattern as Sign In
- Submit calls `signUp(name, email, password)`

### `AuthField` component (`src/features/auth/components/auth-field.tsx`)
Reusable labelled `TextInput` with: label string, error string (shown in red below if non-empty), `secureTextEntry` prop. Used by both screens.

---

## 4. Trip Creation Wizard (`app/(tabs)/trips/new.tsx`)

Full-screen stack route pushed from the "Plan a trip" FAB on the Trips tab.

### Step 1 — Where to?
- Search field filters a local destination list (expanded mock, 8 entries)
- Tapping a suggestion selects it; custom text also accepted
- "Next →" enabled only when destination is non-empty

### Step 2 — When?
- Start date + end date: plain `TextInput` fields (no new dependency; format `YYYY-MM-DD`)
- Night count calculated and shown live: `N nights · N days`
- "Skip — plan later" sets both dates to empty string; trip lands in Drafts tab

### Step 3 — Name it
- Trip name pre-filled from destination (e.g. `"Paris Trip"`); user can edit
- **AI itinerary banner**: shown but disabled with "Coming soon — add key in .env" when `EXPO_PUBLIC_OPENAI_BASE_URL` is empty; enabled and calls `generateTrip()` when key present
- "Create Trip ✓" adds trip to store via `addTrip()`, dismisses wizard, pushes to new Trip Detail

### Pre-fill from Explore
Tapping "Plan →" on a destination card calls `router.push(routes.newTrip({ destination: dest.name }))`. Wizard opens at Step 2 with destination pre-filled.

---

## 5. Trip Detail — Edit, Delete & Stop Management

### Edit Trip Sheet (`src/features/trips/components/edit-trip-sheet.tsx`)
- Triggered by ✏️ Edit button in header
- Fields: trip name, destination, start date, end date
- "Save Changes" calls `updateTrip(id, patch)`
- "🗑 Delete Trip" shows confirmation `Alert` → on confirm calls `deleteTrip(id)` → navigates back to trips list

### Stop Card (`src/features/trips/components/stop-card.tsx`)
New rows added below the existing category badge:

1. **Detail pills row**: `★ {rating}` · `🕘 {openingHours}` · `🎫 {admissionPrice}` — small pill chips in a row
2. **Inline remark row**: 
   - Collapsed: dashed border row showing "✎ Add a note…" (muted) or "✎ *note text*" (italic) if filled
   - Tap: expands into a `TextInput` with blue focus ring; card body tap still navigates to Place Detail
   - On blur or "Done" tap: collapses, calls `updateRemark(tripId, stopId, remark)` in store

### Add Stop Sheet (`src/features/trips/components/add-stop-sheet.tsx`)
- Opened by tapping the dashed "＋ Add a stop" row
- Search field calls `searchPlaces(query)` → shows filtered mock places (or Google Places results when key set)
- Manual entry fallback: place name, time (text), category (picker)
- "Add Stop" calls `addStop(tripId, dayId, stop)`

### Remove Stop
- × button on each StopCard → `Alert` confirmation → `removeStop(tripId, dayId, stopId)`

### AI Suggest
- "✦ Suggest more stops for Day N" calls `suggestStops()` service
- Today: returns a stub list of 2 pre-filled place suggestions shown as Add Stop entries
- When OpenAI key present: returns real AI suggestions

---

## 6. Explore Tab (`app/(tabs)/explore.tsx`)

### Search
- `query` state filters `mockDestinations` by `name` or `tag` (case-insensitive substring)
- Result count shown: `N results for "query"` when query is non-empty
- Hint shown when 0 results: "Can't find your destination? Type it in the trip wizard."

### Category Filter Pills
- Pills: All · City · Nature · Beach · Culture
- Tapping a pill sets `activeCategory` state; "All" resets to `null`
- Filter applied on top of search query (both active simultaneously)

### Destination Cards
- Each card shows: category label (coloured), emoji + name, tag line, coloured "Plan →" button
- Tapping "Plan →" pushes `routes.newTrip({ destination: dest.name })`

### Mock Data
Expand `src/mocks/explore.ts` from 2 to 8 destinations:

| Name | Category | Tag |
|------|----------|-----|
| Lisbon | City | Coastal city breaks |
| Bali | Nature | Nature and calm escapes |
| Kyoto | Culture | Temples and traditions |
| New York | City | Urban energy and culture |
| Amalfi Coast | Beach | Clifftop coastal drives |
| Patagonia | Nature | Wild southern wilderness |
| Barcelona | City | Architecture and nightlife |
| Marrakech | Culture | Souks and desert gateways |

---

## 7. Service Hooks Summary

| Service | Function | Mock result | Real trigger |
|---------|----------|------------|--------------|
| Supabase | `signInWithEmail` | `{ ok: true, user }` | `EXPO_PUBLIC_SUPABASE_URL` set |
| Supabase | `signUpWithEmail` | `{ ok: true, user }` | `EXPO_PUBLIC_SUPABASE_URL` set |
| OpenAI | `generateTrip` | Pre-built mock itinerary | `EXPO_PUBLIC_OPENAI_BASE_URL` set |
| OpenAI | `suggestStops` | 2 mock place suggestions | `EXPO_PUBLIC_OPENAI_BASE_URL` set |
| Google Maps | `searchPlaces` | Filtered `mockDestinations` | `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY` set |

---

## 8. Error Handling

- Auth errors: show banner only on real Supabase errors; mock path never errors
- Trip creation: name field required; wizard blocks progression if destination empty
- Stop deletion: always behind `Alert` confirmation to prevent accidental taps
- Trip deletion: always behind `Alert` confirmation
- Empty states: existing `EmptyState` component used for empty trips list and 0 search results

---

## 9. Testing

Existing Jest + `@testing-library/react-native` setup. Tests to update/add:

- `app-store` — test `addTrip`, `updateTrip`, `deleteTrip`, `addStop`, `removeStop`, `updateRemark`
- `AuthField` — renders label, shows error message, secureTextEntry toggle
- `StopCard` — renders rating/hours/admission pills; inline remark expand/collapse
- `TripsScreen` — reads from store, FAB navigates to wizard
- `ExploreScreen` — search filter, category filter, "Plan →" navigation
