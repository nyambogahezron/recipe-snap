# Recipe Snap - AI Coding Agent Instructions

## Architecture Overview

**Recipe Snap** is an Expo React Native app that combines AI-powered recipe generation with traditional recipe browsing. The app uses a hybrid architecture:

- **Frontend**: Expo Router with React Native, TypeScript, file-based routing
- **Database**: Local SQLite with Drizzle ORM (schema in `database/schema.ts`)
- **Authentication**: Custom service with secure local storage (not Clerk)
- **AI Integration**: Google Gemini for image-to-recipe generation
- **External APIs**: TheMealDB for recipe data, custom API at hardcoded IP

## Core Data Model

```typescript
// Key tables from database/schema.ts:
- users: Custom auth (id, email, passwordHash, name)
- sessions: Auth tokens with expiration
- favorites: User-saved recipes from TheMealDB
- aiRecipes: AI-generated recipes from image analysis
```

## Critical Workflows

### Database Setup

- Initialize SQLite database on app launch (`app/_layout.tsx`)
- Run migrations: `npx drizzle-kit generate && npx drizzle-kit migrate`
- Schema changes require migration generation

### Authentication Flow

- Custom auth service (`database/services/authService.ts`)
- Sessions stored in SecureStore with 30-day expiration
- Passwords hashed with SHA-256 (not bcrypt)
- Auto-login after registration

### AI Recipe Generation

- Camera/image picker captures food photos
- Google Gemini analyzes images to generate recipes
- Results stored as JSON arrays (ingredients, instructions)
- Fallback mock recipes when API unavailable

### External API Integration

- TheMealDB: Primary recipe source (`services/mealAPI.ts`)
- Custom API: Hardcoded IP for additional features
- Robust error handling with fallbacks

## Project-Specific Patterns

### Navigation Structure

```
app/
  _layout.tsx          # Root layout with providers
  (auth)/              # Auth screens (sign-in, sign-up)
  (tabs)/              # Main app (recipes, search, ai, favorites)
  recipe/[id].tsx      # Dynamic recipe detail pages
  api/                 # Expo Router API routes
```

### Component Architecture

- `components/`: Reusable UI components
- `contexts/`: React contexts (AuthContext)
- `services/`: External API clients
- `database/services/`: Local database operations
- `lib/ai/`: AI integration and flows
- `hooks/`: Custom React hooks (useDebounce)

### Styling System

- Constants-based theming (`constants/colors.ts`, `constants/fonts.ts`)
- Style objects in `styles/` directory
- Inter font family loaded globally

### Error Handling

- Toast notifications via `toastService.ts`
- Alert provider for user feedback
- Graceful API failures with fallbacks

## Development Commands

```bash
# Start development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web

# Database operations
npx drizzle-kit generate    # Generate migrations
npx drizzle-kit migrate     # Run migrations
npx drizzle-kit studio      # Database GUI

# Build for production
eas build --platform android
eas build --platform ios
```

## Environment Setup

Required environment variables (`.env`):

```
EXPO_PUBLIC_GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

Get Gemini API key from: https://aistudio.google.com/app/apikey

## Key Files to Reference

- `database/schema.ts`: Data model and types
- `contexts/AuthContext.tsx`: Authentication state management
- `lib/ai/flows/`: AI recipe generation logic
- `services/mealAPI.ts`: External recipe API client
- `app/_layout.tsx`: App initialization and providers
- `constants/api.ts`: API endpoints (note: hardcoded IP)

## Common Patterns

### Database Queries

```typescript
import { db } from '@/database';
import { eq } from 'drizzle-orm';

// Query with Drizzle
const user = await db.select().from(users).where(eq(users.id, userId));
```

### AI Integration

```typescript
import { generateRecipeFromImage } from '@/lib/ai/flows';

const result = await generateRecipeFromImage({
	photoDataUri: 'data:image/jpeg;base64,...',
});
```

### API Routes

```typescript
// app/api/auth+api.ts - Expo Router API route
export async function POST(request: Request) {
	// Handle API requests
}
```

### Navigation

```typescript
import { router } from 'expo-router';

// Navigate to recipe detail
router.push(`/recipe/${recipeId}`);
```

## Testing & Validation

- No formal test suite currently
- Manual testing required for camera/AI features
- Validate database migrations after schema changes
- Test authentication flow end-to-end

## Deployment

- EAS Build for native apps
- Environment variables managed via EAS Secrets
- Production builds auto-increment version</content>
  <parameter name="filePath">/home/junior/Projects/recipe-snap/.github/copilot-instructions.md
