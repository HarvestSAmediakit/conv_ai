# CONVOMAG AI™: Phase 6 - Mobile Applications Architecture

## 1. Mobile Strategy
ConvoMag AI provides native-feeling mobile applications alongside the responsive web PWA. The mobile apps are built using **React Native** (Expo) to share business logic and design tokens with the web platform while deeply integrating with native device capabilities.

## 2. Tech Stack
- **Framework**: React Native with Expo (Managed Workflow, transitioning to EAS Custom Builds).
- **Navigation**: React Navigation (Stack and Bottom Tabs).
- **State Management**: Zustand (Shared logic with Web).
- **Data Fetching**: tRPC or React Query interfacing with the Fastify backend.
- **Offline Storage**: WatermelonDB or Expo SQLite for caching magazines, articles, and chat history.
- **Audio/Voice**: `expo-av` and native WebRTC modules for real-time voice chat and podcast playback.

## 3. Core Features
- **Native PDF & Flipbook Engine**: Utilizing native PDF rendering modules configured for continuous scroll or horizontal paging, optimized for memory management on mobile devices.
- **Persistent Podcast Player**: Global audio playback service that runs in the background. Supports OS-level media controls (lock screen controls).
- **Push Notifications**: Expo Push Notifications integration. Alerts users to new issues, advertiser offers, or finished async generations (like custom podcasts).
- **Offline Mode First**: Heavy emphasis on downloading issues for offline reading. The local SQLite database caches the RAG index for limited localized search when disconnected.

## 4. Folder Structure (React Native)
```text
/mobile
├── /src
│   ├── /api                 # Backend API client
│   ├── /components          # Reusable UI components
│   ├── /hooks               # Custom hooks
│   ├── /navigation          # Route definitions
│   ├── /screens             # Main view screens (Home, Library, Reader, Profile)
│   ├── /store               # Zustand stores
│   ├── /theme               # Colors, typography, spacing
│   └── /utils               # Helpers
├── App.tsx                  # Entry point
├── app.json                 # Expo config
└── package.json
```
