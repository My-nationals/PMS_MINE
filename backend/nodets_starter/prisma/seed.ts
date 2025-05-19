import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });
  if (existingAdmin) {
    console.log('Admin user already exists.');
  } else {
    const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.create({
      data: {
        names: 'Super Admin',
        email: 'admin@example.com',
        telephone: '+250780000000',
        password: hashedAdminPassword,
        role: 'ADMIN',
        verificationStatus: 'VERIFIED',
      },
    });
    console.log('Admin user created:', admin);
  }
  // Create multiple normal users
  const usersData = [
    {
      names: 'Alice Johnson',
      email: 'alice@example.com',
      telephone: '+250781111111',
      password: 'User@123',
    },
    {
      names: 'Bob Smith',
      email: 'bob@example.com',
      telephone: '+250782222222',
      password: 'User@123',
    },
    {
      names: 'Charlie Davis',
      email: 'charlie@example.com',
      telephone: '+250783333333',
      password: 'User@123',
    },
  ];
  for (const userData of usersData) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = await prisma.user.create({
        data: {
          names: userData.names,
          email: userData.email,
          telephone: userData.telephone,
          password: hashedPassword,
          role: 'USER',
          verificationStatus: 'VERIFIED',
        },
      });
      console.log('User created:', newUser.email);
    } else {
      console.log(`User with email ${userData.email} already exists.`);
    }
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });





