# Kirana Customer App

A React Native (Expo) customer ordering application for kirana/grocery shops.

## Features

- 🔐 Customer authentication (login/register)
- 🛍️ Product browsing with categories and search
- 🛒 Shopping cart management
- 📦 Order placement and tracking
- 📱 Mobile-first, village-friendly UI

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure backend API:
   - Update `API_BASE_URL` in `src/api/client.ts`

3. Start the app:
```bash
npm start
```

## Tech Stack

- **React Native** with Expo
- **Expo Router** for file-based navigation
- **TanStack Query** for server state
- **Zustand** for client state (cart, auth)
- **TypeScript** for type safety
- **Axios** for API calls

## Project Structure

- `/app` - Screens and navigation (Expo Router)
- `/src/api` - API client and endpoints
- `/src/store` - Zustand stores
- `/src/hooks` - TanStack Query hooks
- `/src/components` - Reusable components
- `/src/types` - TypeScript types
- `/src/utils` - Utility functions
- `/src/constants` - Design tokens

## API Integration

All backend APIs are integrated:
- Customer auth (register, login, profile)
- Products catalog (categories, products, search)
- Cart operations (add, update, remove, checkout)
- Orders (create, list, details, status, cancel)

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

### Web
```bash
npm run web
```
