import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/**
 * Users table - stores user authentication and profile data
 */
export const users = sqliteTable('users', {
	id: text('id').primaryKey(), // UUID
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
});

/**
 * Sessions table - stores active user sessions
 */
export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(), // UUID
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
});

/**
 * Favorites table - stores user's favorite recipes from external sources
 */
export const favorites = sqliteTable('favorites', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id').notNull(),
	recipeId: text('recipe_id').notNull(),
	title: text('title').notNull(),
	image: text('image'),
	cookTime: text('cook_time'),
	servings: text('servings'),
	category: text('category'),
	area: text('area'),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
});

/**
 * AI Recipes table - stores AI-generated recipes from image analysis
 */
export const aiRecipes = sqliteTable('ai_recipes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id').notNull(),
	recipeName: text('recipe_name').notNull(),
	ingredients: text('ingredients').notNull(), // JSON string array
	instructions: text('instructions').notNull(), // JSON string array
	imageData: text('image_data'), // Base64 encoded image
	imageMimeType: text('image_mime_type'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
export type AIRecipe = typeof aiRecipes.$inferSelect;
export type NewAIRecipe = typeof aiRecipes.$inferInsert;
