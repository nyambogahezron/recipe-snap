# Expo Router API Routes

This directory contains API routes built with Expo Router. These routes provide a REST-like API that can be used for server-side operations or to create API endpoints that work both on web and native platforms.

## Available Endpoints

### Authentication API

**Endpoint:** `/api/auth`

#### POST `/api/auth?action=register`

Register a new user account.

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "securepassword",
	"name": "John Doe" // optional
}
```

**Response (201):**

```json
{
	"user": {
		"id": "uuid",
		"email": "user@example.com",
		"name": "John Doe"
	},
	"token": "session-token"
}
```

#### POST `/api/auth?action=login`

Login with existing credentials.

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "securepassword"
}
```

**Response (200):**

```json
{
	"user": {
		"id": "uuid",
		"email": "user@example.com",
		"name": "John Doe"
	},
	"token": "session-token"
}
```

#### POST `/api/auth?action=logout`

Logout the current user.

**Request Body:** (empty)

**Response (200):**

```json
{
	"message": "Logged out successfully"
}
```

#### POST `/api/auth?action=verify-session`

Verify if the current session is valid.

**Request Body:**

```json
{
	"token": "session-token"
}
```

**Response (200):**

```json
{
	"user": {
		"id": "uuid",
		"email": "user@example.com",
		"name": "John Doe"
	}
}
```

#### PUT `/api/auth?action=update-profile`

Update user profile information.

**Request Body:**

```json
{
	"userId": "uuid",
	"name": "New Name", // optional
	"email": "newemail@example.com" // optional
}
```

**Response (200):**

```json
{
	"user": {
		"id": "uuid",
		"email": "newemail@example.com",
		"name": "New Name"
	}
}
```

#### PUT `/api/auth?action=change-password`

Change user password.

**Request Body:**

```json
{
	"userId": "uuid",
	"currentPassword": "oldpassword",
	"newPassword": "newpassword"
}
```

**Response (200):**

```json
{
	"message": "Password changed successfully"
}
```

#### DELETE `/api/auth?userId=uuid`

Delete user account.

**Response (200):**

```json
{
	"message": "Account deleted successfully"
}
```

---

### AI API

**Endpoint:** `/api/ai`

#### POST `/api/ai?action=identify-dish`

Identify a dish from an image using Google Gemini AI.

**Request Body:**

```json
{
	"photoDataUri": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response (200):**

```json
{
	"dishName": "Pasta Carbonara",
	"confidence": 0.95
}
```

#### POST `/api/ai?action=generate-recipe`

Generate a recipe from an image using Google Gemini AI.

**Request Body:**

```json
{
	"photoDataUri": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Response (200):**

```json
{
	"recipeName": "Creamy Pasta Carbonara",
	"ingredients": [
		"400g spaghetti",
		"200g pancetta or bacon",
		"4 large eggs",
		"100g Parmesan cheese, grated",
		"2 cloves garlic, minced",
		"Salt and black pepper to taste"
	],
	"instructions": [
		"Step 1: Bring a large pot of salted water to boil and cook spaghetti according to package directions",
		"Step 2: While pasta cooks, fry pancetta in a large pan until crispy",
		"Step 3: Whisk eggs and Parmesan cheese together in a bowl",
		"Step 4: Drain pasta, reserving 1 cup of pasta water",
		"Step 5: Add hot pasta to the pan with pancetta",
		"Step 6: Remove from heat and quickly stir in egg mixture",
		"Step 7: Add pasta water as needed to create a creamy sauce",
		"Step 8: Season with salt and pepper, serve immediately"
	]
}
```

**Note:** AI features require a Google Generative AI API key. If not configured, mock data will be returned.

---

### Favorites API

**Endpoint:** `/api/favorites`

#### GET `/api/favorites?userId=uuid`

Get all favorite recipes for a user.

**Response (200):**

```json
[
	{
		"id": 1,
		"userId": "uuid",
		"recipeId": "123",
		"title": "Pasta Carbonara",
		"image": "https://...",
		"cookTime": "30 min",
		"servings": "4",
		"createdAt": "2024-01-01T00:00:00.000Z"
	}
]
```

#### POST `/api/favorites`

Add a recipe to favorites.

**Request Body:**

```json
{
	"userId": "uuid",
	"recipeId": "123",
	"title": "Pasta Carbonara",
	"image": "https://...", // optional
	"cookTime": "30 min", // optional
	"servings": "4" // optional
}
```

**Response (201):**

```json
{
	"id": 1,
	"userId": "uuid",
	"recipeId": "123",
	"title": "Pasta Carbonara",
	"image": "https://...",
	"cookTime": "30 min",
	"servings": "4",
	"createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### DELETE `/api/favorites?userId=uuid&recipeId=123`

Remove a recipe from favorites.

**Response (200):**

```json
{
	"message": "Favorite deleted successfully"
}
```

---

### AI Recipes API

**Endpoint:** `/api/ai/recipes`

#### GET `/api/ai/recipes?userId=uuid`

Get all AI-generated recipes for a user.

**Response (200):**

```json
[
	{
		"id": 1,
		"userId": "uuid",
		"recipeName": "Creamy Pasta",
		"ingredients": ["pasta", "cream", "garlic"],
		"instructions": ["Boil pasta", "Make sauce", "Combine"],
		"imageData": "base64-encoded-image", // optional
		"imageMimeType": "image/jpeg", // optional
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
]
```

#### GET `/api/ai/recipes?userId=uuid&recipeId=1`

Get a specific AI-generated recipe.

**Response (200):**

```json
{
	"id": 1,
	"userId": "uuid",
	"recipeName": "Creamy Pasta",
	"ingredients": ["pasta", "cream", "garlic"],
	"instructions": ["Boil pasta", "Make sauce", "Combine"],
	"imageData": "base64-encoded-image",
	"imageMimeType": "image/jpeg",
	"createdAt": "2024-01-01T00:00:00.000Z",
	"updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST `/api/ai/recipes`

Save a new AI-generated recipe.

**Request Body:**

```json
{
	"userId": "uuid",
	"recipeName": "Creamy Pasta",
	"ingredients": ["pasta", "cream", "garlic"],
	"instructions": ["Boil pasta", "Make sauce", "Combine"],
	"imageData": "base64-encoded-image", // optional
	"imageMimeType": "image/jpeg" // optional
}
```

**Response (201):**

```json
{
	"id": 1,
	"userId": "uuid",
	"recipeName": "Creamy Pasta",
	"ingredients": ["pasta", "cream", "garlic"],
	"instructions": ["Boil pasta", "Make sauce", "Combine"],
	"imageData": "base64-encoded-image",
	"imageMimeType": "image/jpeg",
	"createdAt": "2024-01-01T00:00:00.000Z",
	"updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT `/api/ai/recipes`

Update an existing AI-generated recipe.

**Request Body:**

```json
{
	"recipeId": 1,
	"userId": "uuid",
	"recipeName": "Updated Recipe Name", // optional
	"ingredients": ["new", "ingredients"], // optional
	"instructions": ["new", "instructions"], // optional
	"imageData": "base64-encoded-image", // optional
	"imageMimeType": "image/jpeg" // optional
}
```

**Response (200):**

```json
{
	"id": 1,
	"userId": "uuid",
	"recipeName": "Updated Recipe Name",
	"ingredients": ["new", "ingredients"],
	"instructions": ["new", "instructions"],
	"imageData": "base64-encoded-image",
	"imageMimeType": "image/jpeg",
	"createdAt": "2024-01-01T00:00:00.000Z",
	"updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### DELETE `/api/ai/recipes?userId=uuid&recipeId=1`

Delete an AI-generated recipe.

**Response (200):**

```json
{
	"message": "Recipe deleted successfully"
}
```

---

## Usage Examples

### Using fetch in React Native

```typescript
// Register a new user
const response = await fetch('/api/auth?action=register', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		email: 'user@example.com',
		password: 'securepassword',
		name: 'John Doe',
	}),
});

const data = await response.json();

if (response.ok) {
	console.log('User registered:', data.user);
	console.log('Session token:', data.token);
} else {
	console.error('Registration failed:', data.error);
}
```

```typescript
// Get user's favorites
const userId = 'user-uuid';
const response = await fetch(`/api/favorites?userId=${userId}`);
const favorites = await response.json();

console.log('User favorites:', favorites);
```

```typescript
// Save an AI recipe
const response = await fetch('/api/ai/recipes', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify({
		userId: 'user-uuid',
		recipeName: 'Creamy Pasta',
		ingredients: ['pasta', 'cream', 'garlic'],
		instructions: ['Boil pasta', 'Make sauce', 'Combine'],
	}),
});

const recipe = await response.json();
console.log('Saved recipe:', recipe);
```

## Error Responses

All endpoints return consistent error responses:

```json
{
	"error": "Error message describing what went wrong"
}
```

Common HTTP status codes:

- `400` - Bad Request (validation errors, missing required fields)
- `401` - Unauthorized (invalid credentials, expired session)
- `403` - Forbidden (accessing resources you don't own)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side errors)

## Notes

- All routes work with the local SQLite database
- Authentication uses secure session tokens stored in SecureStore
- API routes can be used for server-side rendering or to create a unified API for web and native platforms
- For production, consider adding rate limiting and additional security measures
