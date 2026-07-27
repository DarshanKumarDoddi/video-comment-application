# Project Requirement Document (PRD)

## 1. Problem Statement

When watching a video, users often want to react to a specific moment. Standard text comments are flat, emotionless, and disconnected from the video timeline. There is no way to convey genuine reaction — tone, facial expression, body language — in a comment.

Existing solutions (YouTube comments, Reddit threads) treat every comment as generic text. None anchor reactions to specific timestamps. None support video replies. The result: shallow, forgettable engagement.

## 2. Solution Summary

Build a mobile-first video platform where the **comment section supports both text and short video clips**, anchored to specific timestamps in the video. Users can:

- Watch embedded YouTube videos
- Post text comments or record/upload short video clip reactions
- Pin any comment to a specific moment in the video
- Reply to any comment, forming threaded conversations

The app does **not** host main video content — real YouTube videos are embedded. The innovation is entirely in the comment layer.

## 3. Target Users

| Persona | Description |
|---------|-------------|
| Casual Viewer | Watches videos, reads comments, occasionally posts text reactions |
| Active Commenter | Frequently posts text and video reactions, engages in threads |
| Content Enthusiast | Uses timestamp anchoring to highlight specific moments |

> This is a **public-facing** mobile application targeting everyday users who want a richer commenting experience than traditional platforms offer.

## 4. Core Features

### Must-Have (MVP)

| Feature | Description |
|---------|-------------|
| Video Embedding | Embed real YouTube videos via URL — users watch, not upload |
| Text Comments | Users post text comments on any video |
| Video Comments | Users record or upload short video clips as comments |
| Timestamp Anchoring | Comments can be pinned to a specific moment in the video |
| Threaded Replies | Comments support nested replies — tree structure, not flat |
| Authentication | Sign up / log in required to comment |
| Home Feed | Grid of available videos to browse |
| Watch Page | Embedded player + full comment section below |
| Search | Find videos by title |

### Nice-to-Have (Post-MVP)

| Feature | Description |
|---------|-------------|
| Like/Dislike on Comments | React to comments with a like count |
| Collapse/Expand Threads | Hide long reply chains to reduce clutter |
| Comment Sorting | By timestamp, recency, or popularity |
| Timestamp Markers on Scrubber | Visual dots on the video progress bar for timestamped comments |
| Push Notifications | Get notified when someone replies to your comment or likes it |
| User Profiles | Avatar, display name, comment history |

## 5. Success Criteria

- User can sign up, log in, and post a text comment on a video
- User can record or upload a video comment and it plays inline in the comment thread
- User can anchor a comment to a timestamp and tap it to seek the video
- Comments form a threaded tree, visually indented under parent comments
- All data persists in the database (not local/mock)
- App runs smoothly on both iOS and Android

## 6. Non-Goals (Explicitly Out of Scope)

- Hosting, uploading, transcoding, or streaming main video content (YouTube handles this)
- Live streaming / live chat
- Monetization (ads, memberships, Super Chat)
- Recommendation algorithm / personalized feed
- Content moderation tooling beyond basic reporting
- Desktop or web application (mobile only)
- Social features (follows, feeds, direct messages)
