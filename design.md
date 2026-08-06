# Design System

## 1. Theme / Tone

- **Style**: YouTube-inspired layout — content-focused feed, top app bar, category chips
- **Modes**: Light + Dark (user-toggleable, system default respected)
- **Tone**: Professional, modern, uncluttered — content is the focus

## 2. Layout (YouTube-inspired)

| Screen | Structure |
|--------|-----------|
| Home | App bar (logo + search/create/notifications/avatar icons) → category chips row → single-column video feed |
| Search | App bar in search mode (back + input) → horizontal result cards |
| Watch | Back header → full-width player → title → channel row (avatar, name, Subscribe) → action bar (like/dislike/share/save) → timestamps → comments header + composer + thread |
| Upload | Title header → form card (URL + title + button) |
| Notifications | Title header → permission banner → list items |
| Profile ("You") | Title header → channel-style header card → options list with icon circles + chevrons |

### Key Layout Rules
- **Top app bar**: 52px row + safe-area inset; logo = accent rounded play box + bold "VidTalk"
- **Category chips**: horizontal scroll, pill (8px radius); active = solid (chipActiveBg), inactive = chipBg
- **Feed cards**: full-width 16:9 thumbnail (no card border), below = 40px avatar + title (2 lines) + "Channel · time ago" meta
- **Tab bar**: 5 tabs, outline/filled icon variants, active = primary

## 2. Color Palette

### Light Mode

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary | Blue | `#3B82F6` | Buttons, links, active states |
| Secondary | Gray | `#6B7280` | Muted text, borders, placeholders |
| Background | White | `#FFFFFF` | Page background |
| Surface | Light Gray | `#F3F4F6` | Cards, comment boxes, inputs |
| Text Primary | Dark | `#111827` | Headings, body text |
| Text Secondary | Medium Gray | `#6B7280` | Timestamps, metadata, captions |
| Accent | Red | `#EF4444` | Likes, errors, notifications |
| Success | Green | `#10B981` | Success messages, confirmations |
| Border | Light Border | `#E5E7EB` | Dividers, card borders, inputs |

### Dark Mode

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary | Blue | `#60A5FA` | Buttons, links, active states |
| Secondary | Gray | `#9CA3AF` | Muted text, borders, placeholders |
| Background | Near Black | `#0F172A` | Page background |
| Surface | Dark Gray | `#1E293B` | Cards, comment boxes, inputs |
| Text Primary | White | `#F1F5F9` | Headings, body text |
| Text Secondary | Light Gray | `#94A3B8` | Timestamps, metadata, captions |
| Accent | Red | `#F87171` | Likes, errors, notifications |
| Success | Green | `#34D399` | Success messages, confirmations |
| Border | Dark Border | `#334155` | Dividers, card borders, inputs |

## 3. Typography

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| H1 | System Default | 28px | 700 | Page titles |
| H2 | System Default | 22px | 600 | Section headings |
| H3 | System Default | 18px | 600 | Card titles, comment author names |
| Body | System Default | 14px | 400 | Comment text, descriptions |
| Caption | System Default | 12px | 400 | Timestamps, metadata |
| Button | System Default | 14px | 500 | All buttons |

> **Font**: Use the platform system font (San Francisco on iOS, Roboto on Android). No custom fonts needed — keeps bundle size small and ensures native feel.

## 4. Spacing & Layout

| Element | Value |
|---------|-------|
| Screen padding | `16px` |
| Card padding | `16px` |
| Section gap | `24px` |
| Comment indent per thread level | `24px` (max `120px`) |
| Border radius (cards) | `8px` |
| Border radius (buttons) | `6px` |
| Touch target minimum | `44px` |

## 5. Components

| Component | Style |
|-----------|-------|
| Primary Button | Blue bg, white text, 6px radius, 44px height |
| Secondary Button | Gray border, transparent bg, blue on press |
| Comment Box | Surface bg, 8px radius, subtle border |
| Video Card | Surface bg, 16:9 thumbnail top, title below |
| Input Fields | Surface bg, border, rounded, focus ring primary |
| Avatar Circle | 32px, primary bg, white initial letter |
| Timestamp Badge | Primary bg, white text, 4px radius, small font |
| Tab Bar | 5 tabs, icons, active = primary color |
