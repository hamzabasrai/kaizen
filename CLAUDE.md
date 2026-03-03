# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npx expo start          # Start dev server (press i for iOS sim, a for Android)
npx expo lint           # ESLint via eslint-config-expo (flat config)
```

No test runner is configured. No custom Babel or Metro config — Expo defaults are used.

## Architecture

**Kaizen** is an iOS-first habit tracking and countdown app built with Expo SDK 54, React Native, and TypeScript (strict mode). React 19 with the React Compiler is enabled.

### Routing — Expo Router v6 (file-based)

- `app/(auth)/` — Login/signup screens (no tab bar)
- `app/(tabs)/` — Bottom tabs: Habits + Countdowns (protected)
- `app/habit/[id].tsx`, `app/habit/new.tsx` — Modal stack screens
- `app/countdown/[id].tsx`, `app/countdown/new.tsx` — Modal stack screens
- `app/_layout.tsx` — Root layout with `AuthProvider` + `ProtectedLayout` (redirects based on auth state using `useSegments()`)
- `app/index.tsx` — Redirects to `/(tabs)/habits`

### Data Flow

```
Supabase (PostgreSQL + Auth + RLS)
  ↕
services/        — Direct Supabase client calls (no REST wrapper)
  ↕
store/           — Zustand v5 stores with AsyncStorage persistence
  ↕
screens/components
```

- **services/** — CRUD functions calling `supabase.from('table').select/insert/update/delete`. All throw on error.
- **store/** — Zustand stores (`useHabitsStore`, `useCountdownsStore`, `useThemeStore`) consume service functions. Only essential fields are persisted via `persist` middleware.
- **context/AuthContext.tsx** — Auth state lives in React Context (not Zustand) because it drives navigation side-effects.

### Backend — Supabase

- Client configured in `lib/supabase.ts` with `AsyncStorage` session storage
- DB types auto-generated in `lib/database.types.ts` — domain types re-exported from `types/`
- Schema with RLS policies defined in `lib/database.sql`
- Tables: `profiles`, `habits`, `habit_completions`, `countdowns` — all have RLS enforcing `auth.uid() = user_id`
- A Postgres trigger (`on_auth_user_created`) auto-creates profile rows

### Styling

- Plain `StyleSheet.create()` — no NativeWind, no component library
- Theme via `useTheme()` hook (wraps `useThemeStore` + `useColorScheme`): components check `isDark` and apply colors inline
- Colors are hardcoded per component (no shared constants file yet)
- iOS system color palette: `#007AFF` blue, `#34C759` green, `#FF9500` orange, `#FF3B30` red
- Icons: `Ionicons` from `@expo/vector-icons` exclusively
- Card border radius: 12, input border radius: 8

### Path Alias

`@/*` maps to project root (configured in `tsconfig.json`). Use `@/lib/supabase`, `@/store/useHabitsStore`, etc.

### Environment Variables

Defined in `.env.local` (gitignored), example in `.env.example`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY`

### Key Dependencies

- `date-fns` for date calculations in services
- `react-native-reanimated` and `react-native-gesture-handler` are installed but not yet used
- Typed routes enabled (`experiments.typedRoutes: true` in app.json)
