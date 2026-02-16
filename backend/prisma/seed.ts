import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始创建种子数据...');

  // 创建创始人账号 - admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@framezero.com' },
    update: {},
    create: {
      email: 'admin@framezero.com',
      username: 'admin',
      password: '$2b$10$CGpxcEEDaCdk.wlqnqbduelgk6Ij8f/48vqPOKDitMqNHo0o/hl5C', // Admin123
      role: Role.FOUNDER,
      emailVerified: true,
      bio: 'Frame Zero 创始人',
    },
  });
  console.log('创始人账号创建完成:', admin.email, '密码: Admin123');

  // 创建创始人账号 - evilgenius
  const evilgenius = await prisma.user.upsert({
    where: { email: 'evilgenius0256@gmail.com' },
    update: {},
    create: {
      email: 'evilgenius0256@gmail.com',
      username: 'evilgenius',
      password: '$2b$10$CGpxcEEDaCdk.wlqnqbduelgk6Ij8f/48vqPOKDitMqNHo0o/hl5C', // Admin123 (same password for now)
      role: Role.FOUNDER,
      emailVerified: true,
      bio: 'Frame Zero 创始人',
    },
  });
  console.log('创始人账号创建完成:', evilgenius.email, '密码: Admin123');

  // 创建测试用户
  const testUser = await prisma.user.upsert({
    where: { email: 'user@framezero.com' },
    update: {},
    create: {
      email: 'user@framezero.com',
      username: 'testuser',
      password: '$2b$10$cqY353fZS1oe63ONMmL/a.hqMhvkrCqCfkaYiGwf.l8PU8SNV1UFW', // User123
      role: Role.USER,
      emailVerified: true,
      bio: '测试用户',
    },
  });
  console.log('测试用户创建完成:', testUser.email, '密码: User123');

  // 创建板块
  const boards = [
    {
      slug: 'check-in',
      name: '打卡板块',
      description: '每日学习打卡，记录成长足迹',
      icon: '📅',
      order: 1,
    },
    {
      slug: 'learning',
      name: '学习分享',
      description: '分享学习资源和技术文章',
      icon: '📚',
      order: 2,
    },
    {
      slug: 'career',
      name: '就业分享',
      description: '面试经验、求职经历、薪资分享',
      icon: '💼',
      order: 3,
    },
    {
      slug: 'blog',
      name: '博客广场',
      description: '发布技术博客和文章',
      icon: '✍️',
      order: 4,
    },
  ];

  for (const board of boards) {
    await prisma.board.upsert({
      where: { slug: board.slug },
      update: {},
      create: board,
    });
  }
  console.log('板块创建完成');

  console.log('种子数据创建完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
