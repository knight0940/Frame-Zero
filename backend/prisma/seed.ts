import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始创建种子数据...');

  // 创建创始人账号
  const founder = await prisma.user.upsert({
    where: { email: 'admin@framezero.com' },
    update: {},
    create: {
      email: 'admin@framezero.com',
      username: 'admin',
      password: '$2b$10$YourHashedPasswordHere', // 需要用实际的bcrypt hash替换
      role: Role.FOUNDER,
      emailVerified: true,
      bio: 'Frame Zero 创始人',
    },
  });
  console.log('创始人账号创建完成:', founder.email);

  // 创建测试用户
  const testUser = await prisma.user.upsert({
    where: { email: 'user@framezero.com' },
    update: {},
    create: {
      email: 'user@framezero.com',
      username: 'testuser',
      password: '$2b$10$YourHashedPasswordHere', // 需要用实际的bcrypt hash替换
      role: Role.USER,
      emailVerified: true,
      bio: '测试用户',
    },
  });
  console.log('测试用户创建完成:', testUser.email);

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
      description: '面试经验、求职心得、薪资分享',
      icon: '💼',
      order: 3,
    },
    {
      slug: 'blog',
      name: '博客广场',
      description: '发布技术博客，展示个人实力',
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
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
