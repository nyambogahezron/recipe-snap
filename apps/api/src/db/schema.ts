import {
	pgTable,
	serial,
	text,
	timestamp,
	integer,
	json,
	varchar,
} from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const favoritesTable = pgTable('favorites', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(),
	recipeId: integer('recipe_id').notNull(),
	title: text('title').notNull(),
	image: text('image'),
	cookTime: text('cook_time'),
	servings: text('servings'),
	createdAt: timestamp('created_at').defaultNow(),
});

export const aiRecipesTable = pgTable('ai_recipes', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull(),
	recipeName: text('recipe_name').notNull(),
	ingredients: json('ingredients').$type<string[]>().notNull(),
	instructions: json('instructions').$type<string[]>().notNull(),
	imageData: text('image_data'), 
	imageMimeType: varchar('image_mime_type', { length: 50 }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export type Favorite = InferSelectModel<typeof favoritesTable>;
export type NewFavorite = InferInsertModel<typeof favoritesTable>;

export type AIRecipe = InferSelectModel<typeof aiRecipesTable>;
export type NewAIRecipe = InferInsertModel<typeof aiRecipesTable>;
