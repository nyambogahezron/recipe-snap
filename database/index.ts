import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from './schema';

/**
 * SQLite database instance for RecipeSnap
 * This database stores user's favorites and AI-generated recipes locally
 */
const expoDb = SQLite.openDatabaseSync('recipeSnap.db');

/**
 * Drizzle ORM instance configured with expo-sqlite
 */
export const db = drizzle(expoDb, { schema });

/**
 * Initialize database tables
 * This should be called when the app starts
 */
export async function initializeDatabase() {
	try {
		// Create users table
		await expoDb.execAsync(`
			CREATE TABLE IF NOT EXISTS users (
				id TEXT PRIMARY KEY,
				email TEXT NOT NULL UNIQUE,
				password_hash TEXT NOT NULL,
				name TEXT,
				created_at INTEGER NOT NULL DEFAULT (unixepoch()),
				updated_at INTEGER NOT NULL DEFAULT (unixepoch())
			);
		`);

		// Create sessions table
		await expoDb.execAsync(`
			CREATE TABLE IF NOT EXISTS sessions (
				id TEXT PRIMARY KEY,
				user_id TEXT NOT NULL,
				token TEXT NOT NULL UNIQUE,
				expires_at INTEGER NOT NULL,
				created_at INTEGER NOT NULL DEFAULT (unixepoch()),
				FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
			);
		`);

		// Create favorites table
		await expoDb.execAsync(`
			CREATE TABLE IF NOT EXISTS favorites (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id TEXT NOT NULL,
				recipe_id TEXT NOT NULL,
				title TEXT NOT NULL,
				image TEXT,
				cook_time TEXT,
				servings TEXT,
				category TEXT,
				area TEXT,
				description TEXT,
				created_at INTEGER NOT NULL DEFAULT (unixepoch())
			);
		`);

		// Create ai_recipes table
		await expoDb.execAsync(`
			CREATE TABLE IF NOT EXISTS ai_recipes (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				user_id TEXT NOT NULL,
				recipe_name TEXT NOT NULL,
				ingredients TEXT NOT NULL,
				instructions TEXT NOT NULL,
				image_data TEXT,
				image_mime_type TEXT,
				created_at INTEGER NOT NULL DEFAULT (unixepoch()),
				updated_at INTEGER NOT NULL DEFAULT (unixepoch())
			);
		`);

		console.log('✅ Database initialized successfully');
	} catch (error) {
		console.error('❌ Error initializing database:', error);
		throw error;
	}
}

/**
 * Reset database (for development/testing)
 */
export async function resetDatabase() {
	try {
		await expoDb.execAsync(`DROP TABLE IF EXISTS sessions;`);
		await expoDb.execAsync(`DROP TABLE IF EXISTS favorites;`);
		await expoDb.execAsync(`DROP TABLE IF EXISTS ai_recipes;`);
		await expoDb.execAsync(`DROP TABLE IF EXISTS users;`);
		await initializeDatabase();
		console.log('✅ Database reset successfully');
	} catch (error) {
		console.error('❌ Error resetting database:', error);
		throw error;
	}
}

export { schema };
