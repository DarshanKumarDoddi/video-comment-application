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
| 2026-08-02 | **CRASH FIXED — confirmed on device.** Build b8db22da (expo-av removed) launches successfully past splash |
| 2026-08-02 | Created `app_crash_solution.txt` (end-to-end crash report); committed 3e1b6c8 and pushed all work to GitHub |
| 2026-08-02 | Decision: keep two-repo split — mobile work only in `video-comment-mobile`; `comment_video` untouched |
| 2026-08-02 | Copied FastAPI backend into this repo (`backend/`) — read-only from comment_video, no files modified there; guarded `../frontend` static mount; all 13 routes verified |
| 2026-08-02 | Backend `.env` + `.env.example` added (gitignored); gitignore rules for venv/__pycache__ |
| 2026-08-02 | Committed a49d7a1 (backend in-repo) |
| 2026-08-02 | Phase 1 VERIFIED complete — tsc 0 errors, Metro android bundle OK, 5 tabs, grid/watch/auth/theme confirmed, types match backend, mock↔real switchable |
| 2026-08-02 | Phase 2 backend verified end-to-end: local uvicorn + real Supabase (old project izustvmcqvvcpoexyotr). Fixed Supabase auth blockers: email-domain allowlist + captcha disabled by user; signup→login→post→reply→like→fetch all persist |
| 2026-08-02 | Cloudflared quick tunnel exposes local backend (`*.trycloudflare.com`) since deployed vidtalk.6281401.xyz is a Next.js frontend, NOT the FastAPI API. `.env` switched to USE_MOCK_DATA=false + tunnel URL |
| 2026-08-02 | lib/auth.ts `ensureUserRow` on signup/login so comment authors get real usernames (was falling back to "User") |
| 2026-08-02 | Metro dev server running in tunnel mode — Expo Go URL: `exp://ibzkdps-darshankumar27-8081.exp.direct:80` |
| 2026-08-02 | **Issue 1 RESOLVED (Google OAuth):** was using direct native Google flow (AuthSession.useAuthRequest + exchangeCodeForSession on a Google code) — wrong flow. Now uses `supabase.auth.signInWithOAuth()` + `WebBrowser.openAuthSessionAsync` + `exchangeCodeForSession(code)`; added `app/auth/callback.tsx` deep-link safety net. Dashboard still needs: Supabase Google provider Client ID/Secret, `https://izustvmcqvvcpoexyotr.supabase.co/auth/v1/callback` redirect URI in Google Cloud, and consent screen published/test-user |
| 2026-08-02 | **Issue 2 RESOLVED (Profile "Not signed in"):** profile.tsx used local state + one-time getCurrentUser on mount. Now consumes `useAuth()`; AuthContext subscribes to `supabase.auth.onAuthStateChange` (SIGNED_IN/INITIAL_SESSION/TOKEN_REFRESHED/SIGNED_OUT) so any login path updates Profile instantly |
| 2026-08-02 | **Issue 3 RESOLVED (RECORD_AUDIO):** expo-camera plugin in app.json missing `recordAudioAndroid:true` + `microphonePermission`; video-record screen only requested camera permission. Both fixed. **Requires native rebuild (eas build) to take effect** |
| 2026-08-05 | **SUPABASE PROJECT MIGRATED** to fresh project `pmvmxxrtxnjkasyevpjs` (new email/account). Google provider ENABLED there (`google:true`), email autoconfirm on, schema created via `backend/supabase_schema.sql`. Old project `izustvmcqvvcpoexyotr` had google permanently `false` (never enabled) + the web-app project `bpicnshefhwnwqhoabhr` is paused. Confirmed `signInWithIdToken` is ALSO gated on provider-enabled (got `provider_disabled`), so dashboard enablement is mandatory |
| 2026-08-05 | Both `.env` files updated to new project (mobile `EXPO_PUBLIC_SUPABASE_*` + backend `SUPABASE_URL/KEY`); backend restarted; full API flow verified against new project |
| 2026-08-05 | Tunnel infra rebuilt: ngrok (`expo start --tunnel`) rate-limited + backend cloudflared died (origin DNS error 530). New backend tunnel `https://href-download-hereby-organizer.trycloudflare.com` (in `.env`), Metro at `exp://ngy3jca-darshankumar27-8081.exp.direct:80` |

## In Progress

| Item | Status |
|------|--------|
| Phase 6 — Polish | Complete: haptics, error states, pull-to-refresh, empty states, infinite scroll |
| Device QA on new APK | Done — app launches on Oppo F25 Pro Plus (build b8db22da). Next: verify video playback + comment flows |
| UI iteration | Upcoming — dev loop via Expo Go (`npx expo start`) + hot reload; no reinstalls |

## Known Blockers / Pending Decisions

| Item | Details |
|------|---------|
| Cloudinary upload preset | `mobile_app_upload` — used by direct-upload path (lib/cloudinary.ts); verify it exists in Cloudinary dashboard |
| Google OAuth (dashboard-side) | Code flow fixed. Confirm in Supabase dashboard: Google provider enabled with correct Client ID/Secret (no spaces/truncation). Confirm in Google Cloud Console: OAuth web client has `https://izustvmcqvvcpoexyotr.supabase.co/auth/v1/callback` in authorized redirect URIs; consent screen Published (or add test email). THEN re-test |
| Camera fix needs native rebuild | Issue 3 fix is a permissions manifest change — requires `eas build`, not just `expo start` reload |
| API secrets in .env | Should rotate if repo is public |
| Backend deployment | Backend lives in-repo (backend/); currently exposed via ephemeral cloudflared tunnel only |

## Notes

- This file must be updated after every work session
- Reference `phases.md` for current phase and next steps
- All 6 phases complete — app ready for testing with real API keys
