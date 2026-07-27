# Project Rules

## 1. Approved Libraries / Frameworks

| Category | Approved | Reason |
|----------|----------|--------|
| UI Framework | React Native + Expo | Cross-platform, managed workflow, strong ecosystem |
| Navigation | Expo Router | File-based routing, tab + stack built-in |
| Database + Auth | Supabase (PostgreSQL) | Managed, free tier, built-in auth |
| Video Playback | react-native-youtube-iframe | Reliable YouTube embed in React Native |
| Camera | expo-camera | Native camera access on both platforms |
| Video Storage | Cloudinary | Free tier, compression, CDN |
| Notifications | expo-notifications | Expo Push Notification Service |
| Auth Storage | expo-secure-store | OS-level encryption for tokens |
| HTTP Client | fetch (built-in) | No extra dependency needed |
| Gestures | react-native-gesture-handler | Required by Expo Router, native gestures |
| Animations | react-native-reanimated | Native-driven animations |
| State | React Context + hooks | Lightweight, no extra state library needed |

## 2. Banned Libraries / Tools

| Banned | Reason |
|--------|--------|
| Redux / Zustand / MobX | Overkill for this app's state complexity. React Context is sufficient. |
| Axios | fetch is built-in and sufficient. No need for another HTTP client. |
| Firebase | Supabase is the chosen BaaS. |
| AWS S3 | Cloudinary handles video storage. |
| NativeBase / React Native Paper | Use built-in StyleSheet API. Avoid heavy UI kit dependencies. |
| React Navigation (bare) | Expo Router is the approved navigation solution. |
| Moment.js / Day.js | Use built-in Date APIs and simple formatting functions. |
| AsyncStorage (for auth) | Use expo-secure-store for sensitive data like auth tokens. |

## 3. Error Handling Conventions

- **API errors**: Backend returns structured JSON: `{ "detail": "error message" }`
- **Mobile**: Surface user-friendly messages via Toast/Alert. Log full details to console.
- **Network errors**: Show retry option. Never crash silently.
- **Auth errors**: Redirect to login screen with clear message.
- **Upload errors**: Show progress state, allow retry. Never lose the user's recorded video.
- **Camera errors**: Handle permission denied gracefully with settings redirect.

## 4. Coding Conventions

- **Language**: TypeScript throughout (`.ts` for logic, `.tsx` for components)
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components/types
- **File naming**: `kebab-case` for file names (e.g., `CommentItem.tsx`)
- **Components**: Functional components with hooks only. No class components.
- **Props**: Define explicit TypeScript interfaces for all component props
- **Imports**: Group order — React/Expo, third-party, local components, lib, types, constants
- **No comments** in code unless explaining non-obvious business logic
- **Meaningful variable names** — no single-letter names except loop counters
- **Each file does one thing** — single component, single utility, single type definition

## 5. AI Assistant Boundaries

| Allowed Autonomously | Needs Explicit Approval |
|----------------------|------------------------|
| Create new UI components | Schema changes (DB migrations) |
| Add/update screens | Adding new npm dependencies |
| Write utility functions | Deleting files |
| Update documentation | Modifying auth flow logic |
| Refactor existing code | Changing .env / config values |
| Add error handling | Modifying Supabase/Cloudinary setup |
| Fix bugs and typos | Changing API endpoint contracts |
