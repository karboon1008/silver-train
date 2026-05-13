# Smart Travel Planner — Design Spec

**Date:** 2026-05-08
**Stack:** React Native + Expo · TypeScript · Supabase · PostgreSQL · Google Maps API · OpenAI API · Zustand · Firebase Cloud Messaging

---

## 1. Overview

A cross-platform mobile travel planning app (iOS + Android) that lets users create, manage, and view trip itineraries with AI-assisted planning. The app targets solo travelers, casual lifestyle travelers, and group/couple travelers equally.

**Design language:** Neo-minimalism + Apple-inspired. Earthy, calm colour palette (Parchment, Sage, Slate, Stone, Ink). SF Pro system font. Spring-curve animations. Frosted glass panels. Dark and light mode.

---

## 2. Navigation & Information Architecture

### Shell
3-tab bottom navigation: **Trips** (home) · **Explore** · **Profile**

The map is not a standalone tab. It lives inside Trip Detail as a compact hero at the top, expandable to full-screen. This gives the map-first visual aesthetic without making it the default landing state.

### Screen Map

```
App
├── Onboarding / Auth
│   ├── Welcome slides (3 cards, swipeable)
│   ├── Sign In / Sign Up (email + Google OAuth via Supabase)
│   └── Auth gate → Tab Shell
│
├── ✈️ Trips (home tab)
│   ├── Trip List — card grid, segmented: Upcoming / Past / Drafts
│   ├── Create Trip (FAB) → Choice sheet: Manual | AI Generate
│   │   ├── Manual: Destination · Name · Dates · Travellers → empty Trip Detail
│   │   └── AI Generate: Destination · Duration · Style chips · Pace → generating → Review & Refine
│   └── Trip Detail
│       ├── Map hero (compact, expand to full-screen)
│       ├── Day strip (horizontal scroll, snaps per day)
│       ├── Activity list (stop cards — see §5)
│       │   └── Place Detail (tap any stop card)
│       ├── Add stop (dashed row)
│       └── ✦ AI suggest button (quiet, bottom of day)
│
├── ✦ Explore
│   ├── Search bar
│   ├── Category filter strip: All · Beach · City · Nature · Culture
│   ├── AI Generate banner → AI Generate flow
│   └── Destination cards → Destination detail → Add to trip
│
└── ◯ Profile
    ├── Settings (theme, notifications, account)
    ├── Saved Places
    └── Offline Trips
```

---

## 3. Design Language

### Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Ink | `#1c1c1e` | Primary text, tab bar active, buttons |
| Parchment | `#f5f5f0` | App background (light) |
| Sage | `#a8c5a0` | AI features, success states, nature accents |
| Slate | `#b8ccd8` | Map water, secondary accents |
| Stone | `#d4c4a8` | Map ground, card backgrounds |
| Mist | `#8e8e93` | Secondary text, placeholders, inactive tabs |

Dark mode inverts Ink ↔ Parchment and deepens all surface colours. No flash on toggle — 300ms cross-fade driven by system preference.

### Typography
System font: SF Pro (iOS) · Inter (Android fallback). No custom font loading.

| Role | Size | Weight | Notes |
|------|------|--------|-------|
| Display | 28px | 200 | Destination hero names |
| Title | 20px | 600 | Screen headings |
| Body | 15px | 400 | Activity text, descriptions |
| Label | 11px | 600 | Category tags, tab names |
| Caption | 9px | 600 | Transport pill, timestamps |

### Surfaces
All floating panels (bottom sheet, search pill, tab bar) use `backdrop-filter: blur(20–28px)` with 88–92% opacity. Fully opaque surfaces only for card bodies.

---

## 4. Gesture System

Horizontal = navigate between things. Vertical = reveal depth. No gesture conflicts with native scroll.

| Gesture | Surface | Behaviour |
|---------|---------|-----------|
| Sheet drag ↕ | Bottom sheet | Snap points at 30% / 60% / 95% of screen height |
| Card swipe ← | Trip list card | Reveals Delete (red) / Archive (grey) actions; spring-back on cancel |
| Long-press drag | Activity stop | Lifts card; haptic on pickup; spring settle on drop; persists `order_index` |
| Pinch | Map hero | Native Google Maps zoom; pins cluster at low zoom |
| Swipe right | Any push screen | iOS full-screen swipe back; gesture drives transition animation |
| Horizontal scroll | Day strip | Snaps per pill; selected pill auto-centres |

---

## 5. Key Screens

### 5.1 Trip List (Home)
- Header: "Good morning" greeting + "My Trips" title
- Segment control: Upcoming · Past · Drafts
- Trip cards: cover emoji thumbnail · destination name · date range · stop count · status badge ("In 4 days", "Draft")
- Swipe left on card → Delete / Archive
- FAB (+) bottom-right → Create Trip sheet

### 5.2 Create Trip — Dual Path

**FAB sheet:** Two options spring up from bottom:
- **Build manually** — form: destination (autocomplete), trip name, date range picker, traveller count
- **Generate with AI** — destination, duration, travel style chips (multi-select: Calm · Culture · Food · Nature · Shopping), pace selector (Relaxed · Balanced · Packed)

**AI generation state:** Days load staggered as the OpenAI stream arrives. Day 1 appears first with real stops; Days 2–N show shimmer skeletons until their stops arrive. A calm sub-label ("Researching best routes…") updates during generation.

**Review & Refine:** Full generated itinerary shown. User can reorder stops, tap to edit, or tap ✦ "Suggest more stops for Day N" (quiet button per day). "Save Trip" commits to Supabase.

### 5.3 Trip Detail
- **Map hero** (90px tall): compact map with numbered colour-coded pins matching activity timeline dots. "Expand ↗" → full-screen map view with all pins labelled.
- **Back button** overlaid top-left on map; returns to Trip List.
- **Trip header:** name + date range.
- **Day strip:** horizontal scrollable pills. Each pill shows date number + day name. Active pill is Ink-filled.
- **Activity list:** see §5.4.
- **Add stop row:** dashed border, "＋ Add a stop" text.
- **AI suggest button:** `✦ Suggest more stops for [Day]` — sage background, never intrusive.

### 5.4 Activity List — Stop Cards

Each stop is a card in a vertical timeline. The timeline connector dot colour matches the activity type:
- 🟢 Green — first stop / morning
- 🔵 Blue — midday
- 🟠 Amber — afternoon
- ⚫ Grey — accommodation / end of day

**Card layout — 3 rows:**

```
[thumb 28px] Place Name                    9:00 AM
[🏛️ Landmark]  Book tickets 2 days early (remark)
[🚶 18 min]  from Eiffel Tower
```

Row 1: rounded-square thumbnail (emoji fallback) · place name (truncated) · scheduled time  
Row 2: category tag · remark text (italic placeholder if empty; tap to edit inline)  
Row 3: transport pill (colour-coded by mode) · "from [previous stop]" label

**Transport pill colours:** 🟢 Walk · 🔵 Metro/Bus · 🟠 Taxi  
**Transport pill tap:** opens map app picker sheet (see §5.5)  
**Card tap:** opens Place Detail (see §5.6)  
**No descriptions or introductions** on the list — tap card for full detail.

### 5.5 Map App Picker Sheet
Triggered by tapping any transport time pill. Bottom sheet springs up showing only installed map apps (checked via `Linking.canOpenURL()`):
- Apple Maps
- Google Maps
- Waze
- Grab / local app (if installed)

Shows the transport mode and duration in the sheet subtitle. Selection deep-links with destination lat/lng and selected transport mode. Falls back to browser Google Maps if no app is installed.

### 5.6 Place Detail
Full-screen push screen (shared element transition from activity card).

**Sections (top to bottom):**
1. **Hero image** (110px) — place photo from Google Places; emoji fallback. Back (←) and Save (♡) buttons overlaid.
2. **Name row** — 32×32 rounded thumbnail beside the place name.
3. **Category badge** — pill tag sourced from Google Places type: 🏛️ Landmark · 🏨 Accommodation · 🛍️ Mall · 🚉 Station · 🍽️ Restaurant · 🌿 Nature · 🎭 Entertainment.
4. **Editable remark** — pencil icon (✎) left-aligned; tap to edit inline; saves to Supabase on blur; italic placeholder when empty. No character limit enforced in UI.
5. **Getting There section** — all transport modes shown (Walk · Metro · Bus · Taxi) with mode icon, route/line label, and tappable duration pill. Duration from Google Directions API, stored in `transport_segments`.
6. **Info rows** — opening hours · rating · admission price (from Google Places Details cache).

No introduction, description, or story text on this screen.

### 5.7 Explore Screen
- Search bar (full-width, rounded, frosted)
- Category filter strip: All · 🏖️ Beach · 🏙️ City · 🌿 Nature · 🏛️ Culture
- **AI Generate banner** — sage gradient, ✦ icon, "Generate a trip with AI" headline, arrow → launches AI Generate flow
- Destination cards (horizontal thumbnail + name + one-line tag + category badge)
- Tap card → Destination detail → "Add to a trip" button

---

## 6. Microinteractions

All animations use spring curves (not easing). Durations are guidelines; tune to feel.

| Trigger | Response |
|---------|----------|
| Tap trip card | Scale to 0.97 on press; spring back on release; shared element hero → map in Trip Detail |
| FAB tap (+) | Sheet springs up from bottom; backdrop dims |
| Add activity | Row inserts with height spring from 0; map pin drops with bounce; light haptic |
| AI generate | Shimmer skeletons; stops fade in staggered (80ms offset per stop) |
| Long-press stop | Card lifts with shadow; haptic on pickup; spring settle on drop |
| Complete day | Day pill gets checkmark; confetti burst (3 particles) on full trip completion |
| Dark mode toggle | 300ms cross-fade; no flash |
| Offline detected | Sage banner slides in from top; online-only actions grey out |
| Remark save fail | Optimistic value reverts; subtle red underline; retry tap target |

---

## 7. Architecture

**Pattern:** Hybrid Feature + Shared Core

```
src/
├── features/
│   ├── auth/          screens · hooks · store slice
│   ├── trips/         screens · hooks · store slice
│   ├── explore/       screens · hooks · store slice
│   └── profile/       screens · hooks · store slice
├── core/
│   ├── components/    Card · Sheet · Button · TransportPill · CategoryBadge · Shimmer
│   ├── theme/         colours · typography · spacing · shadows
│   └── hooks/         useTheme · useOffline · useMapApps
├── services/
│   ├── supabase.ts    DB client + auth helpers
│   ├── openai.ts      Edge Function invoker (generate-trip · suggest-stops)
│   ├── maps.ts        Places API · Directions API · deep-link helpers
│   └── fcm.ts         FCM token registration + notification handlers
├── store/             Zustand root + slice exports
└── navigation/        Expo Router tab + stack config
```

**Rules:**
- Components never import from `services/` directly — always through feature hooks.
- `core/components` has no business logic; it receives props only.
- Each feature's store slice is independent; cross-feature reads go through selectors.

---

## 8. Database Schema

### Tables

**`users`** — id (uuid PK) · email · display_name · avatar_url · travel_style (text[]) · default_pace · created_at

**`trips`** — id · user_id (FK) · name · destination · dest_lat · dest_lng · start_date · end_date · status (enum: upcoming/past/draft) · cover_emoji · ai_generated (bool)

**`days`** — id · trip_id (FK) · date · day_number

**`stops`** — id · day_id (FK) · place_id (FK) · scheduled_time · order_index · remark

**`places`** — id · google_place_id (unique) · name · lat · lng · category · thumbnail_url · rating · opening_hours (jsonb) · cached_at

**`transport_segments`** — id · from_stop_id (FK) · to_stop_id (FK) · mode (enum: walk/metro/bus/taxi) · duration_min · route_label

### Relationships
- `users` → 1:many → `trips`
- `trips` → 1:many → `days`
- `days` → 1:many → `stops`
- `stops` → many:1 → `places` (cached Google data)
- `stops` → 1:many → `transport_segments`

### Security
Row-level security on all tables: users can only SELECT/INSERT/UPDATE/DELETE their own rows. `places` is read-only for all authenticated users (shared cache).

---

## 9. Services

| Service | Purpose | Notes |
|---------|---------|-------|
| Supabase Auth | Email + Google OAuth sign-in | Token auto-refresh; session persisted in MMKV |
| Supabase DB | All CRUD + realtime | RLS enforced; realtime sync across devices for the same user (e.g. editing a trip on phone updates it on tablet) |
| OpenAI (GPT-4o) | Itinerary generation + stop suggestions | Called via Supabase Edge Function only; API key never on device; response_format: json_schema |
| Google Maps SDK | Map rendering | `react-native-maps` with Google Maps provider |
| Google Places API | Place search, autocomplete, details | Results cached in `places` table; re-fetched if `cached_at` > 7 days |
| Google Directions API | Transport durations between stops | Results stored in `transport_segments` on stop add |
| Firebase FCM | Push notification reminders | Token registered via `expo-notifications`; reminder sent via scheduled Edge Function |
| MMKV | Auth token, theme pref, user prefs | Synchronous reads; never stores sensitive trip data |
| AsyncStorage | Offline trip snapshots (JSON) | Written on trip view; read when offline detected |

---

## 10. Offline Strategy

| Data | Strategy |
|------|----------|
| Trip list + itineraries | AsyncStorage JSON snapshot; written every time a trip is opened online |
| Map tiles | Google Maps SDK on-device tile cache (automatic per area viewed) |
| Place details | Cached in `places` table; snapshot included in trip JSON |
| AI generation | Online only; feature greyed out with tooltip when offline |
| Live search | Online only; search bar shows "unavailable" placeholder |
| Push notifications | Online only (FCM) |

Offline state detected via `@react-native-community/netinfo`. Sage banner slides in from top. No crash, no empty state — cached content renders normally.

---

## 11. Error Handling

| Scenario | Handling |
|----------|---------|
| No network on launch | Sage banner; AsyncStorage snapshot loads; network-only actions greyed out |
| OpenAI generation fails | Edge Function returns structured error; inline "Couldn't generate — try again" with retry button; no modal |
| Google Maps unavailable | Transport pills show "–"; map hero shows static placeholder; search shows "unavailable" |
| Auth token expired | Supabase auto-refreshes; on failure, quiet redirect to Sign In with "Session expired" notice |
| Remark save fails | Optimistic update shown; on failure, value reverts + red underline + retry tap |
| Map app not installed | `Linking.canOpenURL()` checked before rendering each app; only installed apps shown; browser fallback if all absent |

---

## 12. Testing

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | Jest | Zustand store actions · service helpers · AI JSON parser · offline cache logic |
| Component | React Testing Library | Stop card rendering · transport pill tap · day strip · remark save on blur |
| Integration | Supabase Local (Docker) | Create trip/day/stop flow · RLS enforcement · stop reorder persistence · transport segment creation |
| E2E | Maestro | Sign up → create trip (manual) → add stop → place detail; AI generate flow; offline trip load; dark mode persistence |
