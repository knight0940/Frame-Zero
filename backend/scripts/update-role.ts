import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function updateRole() {
  const user = await prisma.user.update({
    where: { email: 'evilgenius0256@gmail.com' },
    data: {
      role: Role.FOUNDER,
      emailVerified: true,
    },
  });

  console.log('✅ 角色更新成功！');
  console.log(`邮箱: ${user.email}`);
  console.log(`用户名: ${user.username}`);
  console.log(`新角色: ${user.role}`);

  await prisma.$disconnect();
}

updateRole().catch(console.error);
