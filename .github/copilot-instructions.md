# GitHub Copilot Instructions for Bite

## Project Overview
Bite is an AI-powered recipe app with a **monorepo architecture** containing two distinct workspaces:
- **`api/`**: Express.js backend (Bun runtime) handling AI processing via Google Genkit + Gemini 2.0 Flash
- **`mobile/`**: Expo/React Native app with SQLite for local storage

**Critical Architecture Principle**: The API is **stateless** and focuses solely on AI operations. All data persistence happens client-side in SQLite on the mobile device.

## Workspace Commands

### API Development
```bash
cd api
bun dev              # Development with hot reload
bun build            # Build TypeScript to dist/
bun start            # Run production build
bun type-check       # TypeScript validation
```

### Mobile Development
```bash
cd mobile
bun dev              # Start Expo dev server
bun android          # Run on Android
bun ios              # Run on iOS
```

## AI Integration Pattern (Genkit + Gemini)

All AI features use **Google Genkit flows** with strict Zod schema validation:

### Creating a New AI Flow
1. Define in `api/src/ai/flows/<feature-name>.ts`:
```typescript
import { ai } from '../ai-instance.js';
import { z } from 'zod';

const InputSchema = z.object({
  photoDataUri: z.string().describe('Data URI with base64 image')
});

const OutputSchema = z.object({
  result: z.string()
});

// Define prompt with Genkit's structured format
const prompt = ai.definePrompt({
  name: 'myFeaturePrompt',
  input: { schema: InputSchema },
  output: { schema: OutputSchema },
  prompt: `Your instruction here. Image: {{media url=photoDataUri}}`
});

// Define flow
const myFlow = ai.defineFlow({
  name: 'myFeatureFlow',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
}, async (input) => {
  const { output } = await prompt(input);
  return output!;
});
```

2. Export wrapper function with validation (see `identify-dish-from-image.ts` for reference)
3. Add controller method in `api/src/controllers/aiController.ts` using `AsyncHandler`
4. Register route in `api/src/routes/aiRoutes.ts`

**Key Pattern**: Always validate Data URI format (`data:<mimetype>;base64,<encoded_data>`) before processing.

## Data Flow Architecture

### Image → Recipe Pipeline
```
Mobile (Expo Image Picker) 
  → Convert to Data URI
  → POST to API endpoint
  → Genkit validates with Zod
  → Gemini 2.0 processes image
  → Structured JSON response
  → Mobile saves to SQLite (aiRecipes table)
```

### Database Schema (SQLite - mobile only)
- **`favorites`**: External recipe bookmarks (from MealDB API)
- **`aiRecipes`**: AI-generated recipes stored as:
  - `ingredients`: JSON string array
  - `instructions`: JSON string array
  - `imageData`: Base64 encoded image
  - `userId`: Guest user ID (see `mobile/constants/guestUser.ts`)

**Important**: When querying AI recipes, always `JSON.parse()` the ingredients/instructions fields (see `mobile/database/services/aiRecipesService.ts`).

## Error Handling Conventions

### API Side
Use custom error classes from `api/src/utils/errors.ts`:
```typescript
import { BadRequestError, NotFoundError } from '../utils/errors.js';

throw new BadRequestError('Missing photoDataUri');
```

Wrap async route handlers with `AsyncHandler` to auto-catch errors:
```typescript
import AsyncHandler from '../middleware/AsyncHandler.js';

static myRoute = AsyncHandler(async (req, res) => { /* ... */ });
```

### Mobile Side
Service methods return typed response objects:
```typescript
type AIServiceResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

## Mobile App Navigation

Uses **Expo Router** (file-based routing):
- `app/(tabs)/_layout.tsx` - Tab navigation structure
- `app/(tabs)/index.tsx` - Home screen
- `app/(tabs)/ai.tsx` - AI scanner screen
- `app/recipe/[id].tsx` - Dynamic recipe detail page

**Pattern**: Screens import styles from `assets/styles/<screen-name>.styles.ts` for consistency.

## TypeScript Conventions

1. **Shared Types**: Define request/response types in both workspaces
   - API: `api/src/types/api.ts`
   - Mobile: `mobile/types/ai.ts`

2. **Schema-First Development**: Zod schemas are source of truth
   ```typescript
   const Schema = z.object({ /* ... */ });
   type MyType = z.infer<typeof Schema>;
   ```

3. **File Extensions**: API uses `.js` imports for ESM compatibility (despite `.ts` files)
   ```typescript
   import { ai } from '../ai-instance.js'; // Correct
   ```

## Environment Configuration

### API (.env)
```bash
GOOGLE_GENAI_API_KEY=your_key  # Required for AI features
PORT=5001                       # Optional, defaults to 5001
```

### Mobile
- API URL: Set `EXPO_PUBLIC_API_URL` in `.env` or defaults in `constants/api.ts`
- No secrets stored client-side - all AI keys remain in backend

## Testing AI Features Locally

1. Start API: `cd api && bun dev`
2. Get local IP from terminal output (e.g., `http://192.168.x.x:5001`)
3. Update `mobile/constants/api.ts` with your IP
4. Run mobile: `cd mobile && bun dev`
5. Test image upload in AI tab

**Troubleshooting**: If AI returns mock data, check `GOOGLE_GENAI_API_KEY` is set in `api/.env`.

## Common Patterns

### Adding a New Database Table (Mobile)
1. Add table definition in `mobile/database/schema.ts`
2. Create migration: `bun drizzle-kit generate`
3. Add service in `mobile/database/services/<table>Service.ts`
4. Export from `mobile/database/services/index.ts`

### API Request Timeout Handling
Backend enforces 30s timeout (see `api/src/server.ts`). For long AI operations, consider:
- Streaming responses (not yet implemented)
- Polling-based status checks
- Optimizing prompts for faster Gemini responses

## Key Files to Reference

- **AI Setup**: `api/src/ai/ai-instance.ts`
- **Example Flow**: `api/src/ai/flows/generate-recipe-from-image.ts`
- **Mobile AI Service**: `mobile/services/ai/aiService.ts`
- **Database Schema**: `mobile/database/schema.ts`
- **Error Handling**: `api/src/middleware/errorHandler.ts`
