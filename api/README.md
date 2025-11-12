# Recipe Snap API

A clean, lightweight AI-powered API for recipe generation and dish identification.

## Features

- **Dish Identification**: Identify dishes from images using Google AI
- **Recipe Generation**: Generate detailed recipes from food images
- **No Database**: Stateless API - all data storage handled by mobile app

## Tech Stack

- **Runtime**: Bun/Node.js
- **Framework**: Express.js
- **AI**: Google Generative AI (Genkit)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Bun or Node.js installed
- Google AI API key

### Installation

```bash
# Install dependencies
bun install
# or
npm install
```

### Configuration

Create a `.env` file in the root directory:

```env
PORT=5001
NODE_ENV=development
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

### Running the API

```bash
# Development mode
bun run dev
# or
npm run dev

# Production build
bun run build
bun run start
```

## API Endpoints

### POST `/api/ai/identify-dish`

Identify a dish from an image.

**Request Body:**
```json
{
  "photoDataUri": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dishName": "Pasta Carbonara",
    "confidence": 0.95
  }
}
```

### POST `/api/ai/generate-recipe`

Generate a detailed recipe from a food image.

**Request Body:**
```json
{
  "photoDataUri": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "dishName": "Pasta Carbonara",
    "cuisine": "Italian",
    "prepTime": 15,
    "cookTime": 20,
    "servings": 4,
    "difficulty": "Medium",
    "ingredients": [...],
    "instructions": [...],
    "nutritionalInfo": {...}
  }
}
```

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:

- `400` - Bad Request (missing or invalid data)
- `404` - Not Found (invalid endpoint)
- `500` - Internal Server Error

## Development

```bash
# Type checking
bun run type-check
# or
npm run type-check
```

## License

See LICENSE file for details.
