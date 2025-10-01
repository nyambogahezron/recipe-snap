import { PrismaClient } from '../generated/prisma/index.js';

// Create a singleton instance of Prisma Client
class PrismaClientSingleton {
	private static instance: PrismaClient;

	public static getInstance(): PrismaClient {
		if (!PrismaClientSingleton.instance) {
			PrismaClientSingleton.instance = new PrismaClient({
				log: ['query', 'info', 'warn', 'error'],
			});
		}
		return PrismaClientSingleton.instance;
	}
}

export const prisma = PrismaClientSingleton.getInstance();

// Graceful shutdown
process.on('beforeExit', async () => {
	await prisma.$disconnect();
});
