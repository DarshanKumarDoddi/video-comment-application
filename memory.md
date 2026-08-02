# Project Memory / State Log

## Completed

| Date | Item |
|------|------|
| 2026-07-27 | Project initialized — PRD, architecture, rules, phases, design, memory docs created |
| 2026-07-27 | Directory `video-comment-mobile/` created |
| 2026-07-27 | 6 documentation files written |
| 2026-07-27 | Expo project initialized with TypeScript template (Expo SDK 57) |
| 2026-07-27 | All dependencies installed (navigation, supabase, youtube, camera, haptics, etc.) |
| 2026-07-27 | types/index.ts — All TypeScript types matching backend models |
| 2026-07-27 | constants/theme.ts — Color palette (light/dark), typography, spacing |
| 2026-07-27 | context/ThemeContext.tsx — Light/dark mode provider with SecureStore persistence |
| 2026-07-27 | lib/supabase.ts — Supabase client with SecureStore adapter |
| 2026-07-27 | lib/api.ts — API wrappers with mock data fallback |
| 2026-07-27 | lib/auth.ts — signIn, signUp, signOut, getCurrentUser, setDisplayName |
| 2026-07-27 | lib/youtube.ts — extractVideoId, getYouTubeThumbnail |
| 2026-07-27 | lib/cloudinary.ts — Direct unsigned upload from mobile |
| 2026-07-27 | lib/utils.ts — buildCommentTree, getTimeAgo, formatTimestamp |
| 2026-07-27 | lib/haptics.ts — Light/medium/success/error haptic feedback |
| 2026-07-27 | lib/notifications.ts — Push notification registration and handling |
| 2026-07-27 | hooks/useYouTubePlayer.ts — Player state + seek + time tracking |
| 2026-07-27 | context/AuthContext.tsx — User state + auto-login on mount |
| 2026-07-27 | app/_layout.tsx — Root layout with ThemeProvider, AuthProvider, notification listener |
| 2026-07-27 | app/(tabs)/_layout.tsx — 5-tab navigator |
| 2026-07-27 | app/(tabs)/index.tsx — Home screen with pull-to-refresh video grid |
| 2026-07-27 | app/(tabs)/search.tsx — Search with empty state |
| 2026-07-27 | app/(tabs)/upload.tsx — Upload with haptics |
| 2026-07-27 | app/(tabs)/notifications.tsx — Notifications with login prompt |
| 2026-07-27 | app/(tabs)/profile.tsx — Profile with display name management |
| 2026-07-27 | app/watch/[id].tsx — Watch with timestamp markers, reply handling, currentTime |
| 2026-07-27 | app/auth/login.tsx — Email/password + Google OAuth login |
| 2026-07-27 | app/video-record/index.tsx — Camera with expo-camera (front/back toggle) |
| 2026-07-27 | app/video-record/preview.tsx — Video preview + Cloudinary upload |
| 2026-07-27 | components/VideoCard.tsx — Video thumbnail card |
| 2026-07-27 | components/VideoPlayer.tsx — YouTube iframe wrapper |
| 2026-07-27 | components/CommentItem.tsx — Recursive comment with reply, like, video playback |
| 2026-07-27 | components/CommentThread.tsx — Comment tree with onReply passthrough |
| 2026-07-27 | components/CommentComposer.tsx — Text input + timestamp pin + record button |
| 2026-07-27 | components/TimestampMarker.tsx — Blue time badge |
| 2026-07-27 | components/DisplayNamePrompt.tsx — Display name modal |
| 2026-07-27 | .env file with real Supabase anon key |
| 2026-07-27 | All 6 phases implemented — zero TypeScript errors |
| 2026-07-30 | Diagnosed launch crash: `expo-av` (SDK 54 module) vs Hermes RN 0.86 JSI ABI mismatch |
| 2026-07-30 | Fixed crash: switched app.json `jsEngine` to `jsc`; EAS build 2fddbf10 succeeded |
| 2026-07-30 | Verified TS types match backend Python models; fixed like route to `/api/videos/{id}/like` |
| 2026-07-30 | Added client-side infinite scroll for comments (PAGE_SIZE 5) and home feed (PAGE_SIZE 10) |
| 2026-07-30 | Fixed video comment flow: videoId/parentId now propagate through record→preview→watch (was hardcoded mock-1) |
| 2026-07-30 | Added notification permission-denied banner with settings redirect (Linking.openSettings) |
| 2026-07-30 | Fixed mock-data leak in fetchVideos (mock videos no longer merged into real backend results) |
| 2026-07-30 | Committed dcfc6ea; added CRASH_REPORT.md; gitignored *.apk / bugreport-*.zip |
| 2026-08-02 | JSC build (194f09f1) confirmed STILL crashing — engine swap can't fix a broken native lib |
| 2026-08-02 | Discovered SDK 57 always runs New Architecture (newArchEnabled:false is a no-op on RN 0.82+) |
| 2026-08-02 | Removed expo-av entirely; migrated both video components to expo-video@57.0.2 |
| 2026-08-02 | Removed dead workarounds from app.json: `jsEngine: "jsc"` and `newArchEnabled: false` |
| 2026-08-02 | npx tsc --noEmit passes; new EAS build kicked off to verify |

## In Progress

| Item | Status |
|------|--------|
| Phase 6 — Polish | Complete: haptics, error states, pull-to-refresh, empty states, infinite scroll |
| Device QA on new APK | Pending — install latest build (expo-av removed), uninstall old app first, verify launch |

## Known Blockers / Pending Decisions

| Item | Details |
|------|---------|
| Cloudinary upload preset | Needs to be created in Cloudinary dashboard |
| Google OAuth | Needs EXPO_PUBLIC_GOOGLE_CLIENT_ID in .env |
| API secrets in .env | Should rotate if repo is public |

## Notes

- This file must be updated after every work session
- Reference `phases.md` for current phase and next steps
- All 6 phases complete — app ready for testing with real API keys
