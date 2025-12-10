const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('🔍 Test de connexion...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Test de connexion
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connexion réussie!');
    console.log('Résultat:', result);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('Code:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

test();