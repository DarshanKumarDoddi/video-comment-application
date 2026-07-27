# Project Phases

## Current Phase: Phase 1

---

## Phase 1 — Project Setup & Foundation

**Goal**: Working Expo project foundation with all screens scaffolded, theme system, types, and API layer.

**Deliverables**:
- Expo project initialized with TypeScript
- Expo Router with tab navigation (Home, Search, Upload, Notifications, Profile)
- All screens created with functional UI
- Theme system (light/dark) with React Context
- TypeScript types matching backend models
- Supabase client configured with SecureStore
- API layer ready (mock data by default, switchable to live backend)
- Core components: VideoCard, VideoPlayer, CommentItem, CommentThread, CommentComposer
- Utility modules: YouTube ID parser, time-ago formatter, thumbnail URL builder

**Exit Criteria**:
- [ ] App initializes and runs with `npx expo start`
- [ ] Tab navigation works (5 tabs)
- [ ] Home screen shows video grid with mock data
- [ ] Watch screen renders player + comment thread
- [ ] Auth screen has functional login/signup form
- [ ] Theme toggle works (light ↔ dark)
- [ ] All TypeScript types match backend Python models
- [ ] API layer is switchable between mock and real
- [ ] Zero TypeScript errors

---

## Phase 2 — Core UI & Comment System

**Goal**: Full comment system with threaded replies, video playback, and timestamp anchoring.

**Deliverables**:
- Recursive comment tree rendering with indentation
- Reply to any comment (nested threading)
- Text comment posting with real API calls
- Like functionality on comments
- Timestamp anchoring (pin comment to video time)
- Click-to-seek from timestamped comments
- Comment sorting (latest vs timestamp)
- Timestamp markers on video scrubber
- Display name prompt on first login

**Exit Criteria**:
- [ ] User can post a text comment that persists in Supabase
- [ ] Comments appear in threaded tree immediately
- [ ] User can reply to any comment (nested)
- [ ] Like count updates in real-time
- [ ] Timestamp-anchored comments show time badge
- [ ] Tapping timestamp seeks video to that second
- [ ] Sort toggle works (latest / timestamp)

---

## Phase 3 — Video Comments

**Goal**: Users can record and upload video clips as comments.

**Deliverables**:
- Camera screen using expo-camera
- Record video clips (max 60 seconds)
- Front/back camera toggle
- Video preview before posting
- Upload to Cloudinary (unsigned preset)
- Video playback inline in comment thread
- Thumbnail/preview for video comments
- Upload progress indicator

**Exit Criteria**:
- [ ] User can record a video clip from in-app camera
- [ ] Video is compressed and uploaded to Cloudinary
- [ ] Video comment plays inline in the thread
- [ ] Works for both top-level and reply comments
- [ ] Upload failure shows retry option

---

## Phase 4 — Authentication & User Features

**Goal**: Complete authentication flow with session persistence.

**Deliverables**:
- Google sign-in via expo-auth-session + Supabase
- Email/password sign-up and login
- Session persistence with expo-secure-store
- Auto-login on app launch
- Profile screen with user info
- Sign out functionality
- Display name management

**Exit Criteria**:
- [ ] User can sign up with email/password
- [ ] User can log in with Google OAuth
- [ ] Session tokens persist across app restarts
- [ ] Logged-out users see login prompt on comment actions
- [ ] Profile shows user info and allows sign out

---

## Phase 5 — Push Notifications & Engagement

**Goal**: Users receive notifications for replies and likes.

**Deliverables**:
- Expo push token registration on login
- Token stored in Supabase device_tokens table
- Notification permission request flow
- Handle notification taps (deep link to watch page)
- Notification list screen (placeholder → real)

**Exit Criteria**:
- [ ] User receives push notification when someone replies to their comment
- [ ] User receives push notification when someone likes their comment
- [ ] Tapping notification opens the correct watch page
- [ ] Notification permission denied shows settings redirect

---

## Phase 6 — Polish & Release

**Goal**: Production-ready app for App Store and Google Play submission.

**Deliverables**:
- Haptic feedback (like, post, upload complete)
- Loading states (skeletons, spinners, progress bars)
- Error states (network errors, empty states)
- Pull-to-refresh on home feed
- Infinite scroll for comments
- App Store assets (screenshots, description, privacy policy)
- TestFlight / Internal Testing builds
- Final QA pass on real devices

**Exit Criteria**:
- [ ] No crashes on core flows (browse, watch, comment, record)
- [ ] Works on low-end Android and older iOS devices
- [ ] App Store and Google Play submissions approved
- [ ] Privacy policy covers camera, video storage, OAuth data
