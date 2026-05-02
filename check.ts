import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No users found.');
    return;
  }

  const token = jwt.sign(
    { userId: user.user_id, email: user.email },
    'nutri_guide_jwt_secret_key_2026',
    { expiresIn: '1h' }
  );

  console.log('Fetching articles with token...');
  try {
    const res = await fetch('http://localhost:3000/api/articles', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Response Status:', res.status);
    const data = await res.json();
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (error: any) {
    console.log('Error:', error);
  }
}

main().finally(() => prisma.$disconnect());
