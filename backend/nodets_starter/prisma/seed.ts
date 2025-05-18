import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    return;
  }
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.create({
    data: {
      names: 'Super Admin',
      email: 'admin@example.com',
      telephone: '+250780000000',
      password: hashedPassword,
      role: 'ADMIN',
      verificationStatus: 'VERIFIED',
    },
  });
  console.log('Admin user created:', admin);
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

















