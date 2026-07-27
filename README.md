# VidTalk

A mobile-first video commenting platform where users watch YouTube videos and react with text or short video clips, anchored to specific timestamps, with threaded replies.

## Overview

Text comments on videos are flat and emotionless. VidTalk adds a video comment layer on top of embedded YouTube videos — users record or upload short reaction clips, pin them to timestamps, and reply in threads. See [PRD.md](PRD.md) for the full product spec.

## Tech Stack

- **Runtime**: React Native + Expo SDK 57 (TypeScript)
- **Navigation**: Expo Router (file-based)
- **Database + Auth**: Supabase (PostgreSQL)
- **Video Playback**: react-native-youtube-iframe
- **Video Storage**: Cloudinary (direct unsigned upload)
- **Camera**: expo-camera (Phase 3)
- **Push Notifications**: expo-notifications (Phase 5)
- **Auth Storage**: expo-secure-store (iOS Keychain / Android Keystore)

See [architecture.md](architecture.md) for full details.

## Prerequisites

- **Node.js** >= 22.x
- **npm** >= 10.x
- **Expo CLI** (`npx expo` — no global install needed)
- iOS: Xcode + CocoaPods
- Android: Android Studio + SDK 34+

## Installation

```bash
# Clone the repo
git clone <repo-url>
cd video-comment-mobile

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or run on a simulator:

```bash
npx expo start --ios
npx expo start --android
```

## Configuration

Copy `.env` and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|----------|----------------|
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → `anon` key |
| `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Dashboard → Settings → Upload → Upload presets (create unsigned) |

Set `EXPO_PUBLIC_USE_MOCK_DATA=false` to connect to the live backend.

See [architecture.md](architecture.md#4-tech-stack) for all environment variables.

## Quick Start

```bash
# With mock data (no keys needed):
EXPO_PUBLIC_USE_MOCK_DATA=true npx expo start

# With live API:
EXPO_PUBLIC_USE_MOCK_DATA=false npx expo start
```

The app shows 3 sample videos with threaded comments. Navigate tabs, tap a video to watch, and post comments.

## Project Structure

```
video-comment-mobile/
├── app/              # Expo Router screens (tabs, watch, auth)
├── components/       # Reusable UI (VideoCard, CommentThread, etc.)
├── lib/              # API clients, auth, utilities
├── hooks/            # Custom React hooks
├── types/            # TypeScript interfaces
├── constants/        # Theme tokens (colors, spacing)
├── context/          # React Context providers
└── assets/           # Icons, splash screen
```

See [architecture.md](architecture.md#3-folder--file-structure) for full breakdown.

## Documentation

| File | Description |
|------|-------------|
| [PRD.md](PRD.md) | Product requirements, features, success criteria |
| [architecture.md](architecture.md) | System design, folder structure, tech stack |
| [rules.md](rules.md) | Coding conventions, approved/banned libs, AI boundaries |
| [phases.md](phases.md) | Build phases with deliverables and exit criteria |
| [design.md](design.md) | Color palettes, typography, component styles |
| [memory.md](memory.md) | Running log of completed work and blockers |

## Development

```bash
npx expo start          # Dev server with hot reload
npx tsc --noEmit        # TypeScript type check
```

See [rules.md](rules.md) for coding conventions, approved libraries, and AI-assistant guardrails.

## Roadmap

**Current phase**: Phase 1 — Project Setup & Foundation. See [phases.md](phases.md) for the full 6-phase roadmap.

## License

Private — not yet licensed for public use.

## Contact

Project owner: 27092004 (GitHub)
