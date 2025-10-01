CREATE TABLE "ai_recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_name" text NOT NULL,
	"ingredients" json NOT NULL,
	"instructions" json NOT NULL,
	"image_data" text,
	"image_mime_type" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
