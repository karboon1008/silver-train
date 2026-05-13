# Smart Travel Planner - Foundation Design Spec

**Date:** 2026-05-08  
**Scope:** Foundation slice  
**Stack:** Expo Router · Expo SDK · React Native · TypeScript · Zustand · Stubbed service adapters

---

## 1. Objective

Build the first implementation slice of the Smart Travel Planner described in `docs/smart-travel-planner-system-design.pdf`.

This slice establishes the app shell and codebase structure without connecting any live backend or third-party APIs. It should be usable as the base for later slices covering trips, AI generation, maps, auth, and offline support.

---

## 2. In Scope

- Create an Expo Router mobile app foundation in this folder
- Set up route groups and layouts for auth flow and tab shell
- Implement placeholder screens for onboarding, auth, Trips, Explore, and Profile
- Create shared theme tokens for light and dark mode
- Add reusable shell-level components used by placeholder screens
- Add typed environment/config wiring for future integrations
- Create stub service modules for Supabase, OpenAI, Maps, and notifications
- Add mock data sources for UI placeholders
- Add a small initial Zustand store for app/session UI state

---

## 3. Out of Scope

- Real Supabase authentication
- Real database integration
- Real OpenAI itinerary generation
- Real Google Maps or Places rendering
- Push notification registration
- Offline persistence
- Production trip CRUD behavior

These remain intentionally deferred so the foundation stays stable and easy to extend.

---

## 4. Architecture

The implementation should follow the structure already described in the broader travel planner design, but only the parts needed for the foundation slice should be created now.

```text
app/
  _layout.tsx
  index.tsx
  (auth)/
    _layout.tsx
    welcome.tsx
    sign-in.tsx
    sign-up.tsx
  (tabs)/
    _layout.tsx
    trips.tsx
    explore.tsx
    profile.tsx

src/
  config/
    env.ts
    app-config.ts
  core/
    components/
    theme/
    hooks/
    constants/
  features/
    auth/
    trips/
    explore/
    profile/
  mocks/
  services/
    supabase.ts
    openai.ts
    maps.ts
    notifications.ts
  store/
    app-store.ts
```

Rules for this slice:

- Route files stay thin and delegate UI to feature or core components.
- Service files expose stable interfaces but do not perform real network work.
- Shared UI primitives remain business-logic free.
- Feature folders may stay shallow for now, but naming should match future product areas.

---

## 5. Navigation Design

Navigation should use Expo Router.

### Route model

- `app/index.tsx` decides whether to send the user to the auth flow or tab shell based on local placeholder session state.
- `app/(auth)` contains the onboarding and auth placeholder flow.
- `app/(tabs)` contains the primary application shell.

### Auth group

- `welcome`
- `sign-in`
- `sign-up`

These screens are visual placeholders only. Buttons may update local state or route between screens, but must not call live auth providers.

### Tab group

- `trips`
- `explore`
- `profile`

Tab naming should match the PDF exactly. The map remains out of the tab bar and is deferred to later trip detail work.

---

## 6. UI Foundation

The design system should follow the PDF's neo-minimal, calm, Apple-inspired direction, but only to the level needed for shell screens and reusable structure.

### Theme tokens

Create tokenized values for:

- Colors
- Typography
- Spacing
- Radii
- Shadows
- Motion constants

Support both light and dark themes from the start. The foundation only needs theme objects and a simple hook/provider strategy, not a full animation system.

### Core reusable components

Initial components should focus on layout and shell consistency:

- `Screen`
- `AppText`
- `AppButton`
- `AppCard`
- `SectionHeader`
- `SegmentedControl`
- `FloatingActionButton`
- `EmptyState`
- `SearchField`
- `ListRow`

These components should be generic enough to survive into later slices.

---

## 7. Placeholder Screen Behavior

### Welcome

- Shows brand/title and short intro to the app
- CTA buttons route to `sign-in` and `sign-up`

### Sign In / Sign Up

- Show static form fields
- Primary button updates local session state and routes into the tab shell
- Secondary links switch between sign-in and sign-up

### Trips

- Header area
- Segmented control for `Upcoming`, `Past`, `Drafts`
- Placeholder trip cards driven by mock data
- Floating action button visible but non-destructive

### Explore

- Search field shell
- AI generate banner shell
- Destination card placeholders from mock data

### Profile

- User summary placeholder
- Settings-style rows for theme, notifications, and account

The goal is visual and structural completeness, not feature completeness.

---

## 8. Config and Environment Wiring

Add a typed config layer now so future integration work has a defined contract.

### Environment contract

Expected variables should include placeholders for:

- Supabase URL
- Supabase anon key
- OpenAI edge function base URL or project URL reference
- Google Maps API key
- Google Places API key
- Google Directions API key
- Notifications project identifiers if needed later

### Requirements

- Missing values should not crash the foundation in normal placeholder flows.
- Config parsing should centralize validation and default behavior.
- A sample env file should document expected keys clearly.

---

## 9. Service Layer Design

Each service module should expose a minimal interface and return stubbed results or explicit "not connected" placeholders.

### `supabase.ts`

- Exports client factory placeholder or typed config holder
- Exports no-op auth/session helpers for future replacement

### `openai.ts`

- Exports placeholder functions for itinerary generation and stop suggestion
- Must fail predictably with a typed "not implemented" result rather than ad hoc exceptions

### `maps.ts`

- Exports placeholder helpers for place search, directions, and deep-link shaping
- Should include typed models for future place and route data

### `notifications.ts`

- Exports placeholder registration and scheduling interfaces
- Returns deterministic stub outcomes

This keeps later implementation focused on swapping internals instead of reshaping call sites.

---

## 10. State Management

Use a small Zustand store only for shell state that is genuinely useful now.

Recommended initial state:

- `isAuthenticated` placeholder boolean
- `themePreference` with `system | light | dark`
- basic user placeholder object

Do not add full trip domain state yet. Mock data can remain module-local until real flows are implemented.

---

## 11. Testing Expectations

This slice should include lightweight validation only.

- App boots into a valid route
- Auth placeholder can enter tab shell
- Theme/config modules load without crashing
- Stub service modules are importable and typed consistently

If the environment does not support running the app fully, the implementation should still aim for static correctness and clean structure.

---

## 12. Implementation Notes

- Prefer TypeScript throughout.
- Keep file boundaries small and obvious.
- Avoid premature native integration setup beyond what Expo Router needs.
- Use mocked content that resembles the product direction without hard-coding backend assumptions into UI primitives.
- Favor structure that reduces rework in the next slice: Trips list and Trip detail.

---

## 13. Success Criteria

The foundation slice is successful when:

- The project contains a runnable Expo Router app scaffold
- The app has auth and tab route groups wired correctly
- Placeholder screens render with a coherent theme
- Shared components support consistent shell UI
- Config and service wiring exist for later integrations
- No live backend or third-party connection is required for the app to render
