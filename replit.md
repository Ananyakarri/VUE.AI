# StyleSense AI - Virtual Try-On Application

## Overview

StyleSense AI is a simplified virtual try-on application that demonstrates clothing overlay functionality. The application has been rebuilt as a single-page application using vanilla HTML, CSS, and JavaScript for better compatibility and performance.

## System Architecture

The application follows a simplified static web architecture:

### Frontend Architecture
- **Core**: Vanilla HTML5, CSS3, and JavaScript ES6
- **Styling**: Custom CSS with gradient backgrounds and responsive design
- **Webcam Integration**: Native Web APIs for camera access
- **Virtual Try-On**: Canvas-based clothing overlay system

### Demo Features
- **Interactive Clothing Selection**: Grid-based clothing catalog with categories
- **Visual Feedback**: Animated demo mode with person silhouette
- **Camera Integration**: Optional webcam access for real-time try-on
- **Responsive Design**: Works on desktop and mobile devices

## Key Components

### Database Schema
```typescript
// Users table for authentication
users: { id, username, password }

// Clothing items catalog
clothingItems: { id, name, category, imageUrl, overlayData }

// User-created outfit combinations
outfits: { id, userId, name, clothingItems[], createdAt }
```

### Core Frontend Components
- **CameraView**: Manages webcam access and pose detection integration
- **ClothingPanel**: Displays clothing catalog with category filtering
- **SettingsModal**: Configuration for pose detection sensitivity and camera settings
- **ClothingOverlay**: Canvas-based rendering for virtual clothing placement

### API Endpoints
- `GET /api/clothing` - Retrieve all clothing items
- `GET /api/clothing/category/:category` - Filter by clothing category
- `POST /api/clothing` - Add new clothing items
- `POST /api/outfits` - Save outfit combinations

### Pose Detection Integration
- MediaPipe Pose provides 33 body landmarks with x, y, z coordinates and visibility scores
- Key landmarks used: shoulders, hips, chest, waist for clothing placement
- Real-time processing at configurable frame rates (up to 30fps)

## Data Flow

1. **Initialization**: User grants camera access, MediaPipe Pose model loads
2. **Real-time Detection**: Video frames processed to extract body landmarks
3. **Clothing Overlay**: Selected clothing items positioned using landmark coordinates
4. **User Interaction**: Clothing selection updates overlay rendering in real-time
5. **Outfit Saving**: User can save clothing combinations to database

## External Dependencies

### Core Libraries
- **MediaPipe Pose**: Google's pose detection model (loaded via CDN)
- **React Query**: Server state management and caching
- **Radix UI**: Accessible component primitives
- **Drizzle ORM**: Type-safe database operations

### Database
- **PostgreSQL**: Primary data storage
- **Neon Database**: Serverless PostgreSQL provider via `@neondatabase/serverless`

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Development server and build tooling
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Environment
- Replit-hosted with live reload
- Vite dev server for frontend hot module replacement
- tsx for TypeScript execution in development

### Production Build
- Frontend: Vite build to static assets
- Backend: ESBuild bundling with external packages
- Single deployment artifact with static file serving

### Database Migration
- Drizzle Kit for schema management
- PostgreSQL connection via environment variables
- Push-based migrations for development workflow

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 26, 2025. Initial setup