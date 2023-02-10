import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

process.on('SIGINT', async () => {
    console.log('SIGINT');
    await prisma.$disconnect();
    process.exit();
})

export { prisma }