# Kirana Customer App

Customer-facing grocery ordering application built with React + Vite + Ionic.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL and tenant ID:
```
VITE_API_BASE_URL=http://your-backend-url
VITE_TENANT_ID=your_tenant_id
```

4. Run development server:
```bash
npm run dev
```

## Features

- 📱 Mobile-first design
- 🌐 i18n support (English & Hindi)
- 🛒 Shopping cart (persisted in localStorage)
- 📦 Product catalog with categories
- 🔍 Product search
- 📋 Order management
- 💰 Manual payment options (UPI/Cash/At Shop)
- 👤 Customer authentication via OTP

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Ionic React** - Mobile UI components
- **Zustand** - State management
- **i18next** - Internationalization
- **Axios** - HTTP client
- **TypeScript** - Type safety

## Project Structure

```
src/
├── app/           # App configuration, routing
├── features/      # Feature modules (auth, catalog, cart, orders, profile)
├── components/    # Reusable UI components
├── services/      # API & storage services, i18n
├── store/         # Zustand stores (auth, cart)
├── utils/         # Utility functions
├── theme/         # CSS & Ionic theme
└── assets/        # Static assets
```

## Build for Production

```bash
npm run build
```

## License

Proprietary
