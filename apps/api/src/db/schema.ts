import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';
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

export type Favorite = InferSelectModel<typeof favoritesTable>;
export type NewFavorite = InferInsertModel<typeof favoritesTable>;
