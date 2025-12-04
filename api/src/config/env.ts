import 'dotenv/config';

interface Environment {
	PORT: number;
	NODE_ENV: string | undefined;
	GOOGLE_GENAI_API_KEY: string | undefined;
}

export const ENV: Environment = {
	PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5001,
	NODE_ENV: process.env.NODE_ENV,
	GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
};
