# Frame Zero - 数据库设计文档

## 1. 数据库概述

### 1.1 数据库选型

**数据库:** PostgreSQL 14+

**选择理由:**
- 开源免费，社区活跃
- 支持复杂查询和事务
- JSON字段支持，存储灵活数据
- 全文搜索功能强大
- 支持数组类型（适合标签等场景）
- 成熟的ORM支持（Prisma）

### 1.2 数据库连接

```env
DATABASE_URL="postgresql://user:password@localhost:5432/frame_zero?schema=public"
```

### 1.3 命名规范

- **表名:** 小写，复数形式，蛇形命名法 (users, posts, check_ins)
- **字段名:** 小写，驼峰命名法 (createdAt, userId)
- **索引名:** `idx_表名_字段名` (idx_users_email)
- **唯一索引:** `uidx_表名_字段名` (uidx_users_email)
- **外键:** `fk_表名_字段名` (fk_posts_authorId)

---

## 2. 数据库表设计

### 2.1 用户表 (users)

存储用户基本信息和认证数据。

```sql
CREATE TABLE users (
  id            VARCHAR(25) PRIMARY KEY,  -- CUID
  email         VARCHAR(255) UNIQUE NOT NULL,
  username      VARCHAR(20) UNIQUE NOT NULL,
  password      VARCHAR(255) NOT NULL,    -- bcrypt加密
  avatar        VARCHAR(500),
  bio           TEXT,
  role          VARCHAR(20) NOT NULL DEFAULT 'USER',
  status        VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  emailVerified BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱地址，用于登录 |
| username | VARCHAR(20) | UNIQUE, NOT NULL | 用户名，3-20字符 |
| password | VARCHAR(255) | NOT NULL | bcrypt加密后的密码 |
| avatar | VARCHAR(500) | NULLABLE | 头像URL |
| bio | TEXT | NULLABLE | 个人简介，最多500字 |
| role | VARCHAR(20) | NOT NULL | 角色: FOUNDER, ADMIN, USER |
| status | VARCHAR(20) | NOT NULL | 状态: ACTIVE, BANNED, DELETED |
| emailVerified | BOOLEAN | NOT NULL | 邮箱是否已验证 |
| createdAt | TIMESTAMP | NOT NULL | 注册时间 |
| updatedAt | TIMESTAMP | NOT NULL | 最后更新时间 |

**索引:**

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_createdAt ON users(createdAt);
```

**枚举类型:**

```sql
CREATE TYPE user_role AS ENUM ('FOUNDER', 'ADMIN', 'USER');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'BANNED', 'DELETED');
```

---

### 2.2 会话表 (sessions)

存储用户登录会话，支持Token刷新和多点登录。

```sql
CREATE TABLE sessions (
  id           VARCHAR(25) PRIMARY KEY,  -- CUID
  userId       VARCHAR(25) NOT NULL,
  token        VARCHAR(500) UNIQUE NOT NULL,
  refreshToken VARCHAR(500) UNIQUE,
  expiresAt    TIMESTAMP NOT NULL,
  createdAt    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| userId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 关联用户ID |
| token | VARCHAR(500) | UNIQUE, NOT NULL | JWT Access Token |
| refreshToken | VARCHAR(500) | UNIQUE | JWT Refresh Token |
| expiresAt | TIMESTAMP | NOT NULL | Token过期时间 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |

**索引:**

```sql
CREATE INDEX idx_sessions_userId ON sessions(userId);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_refreshToken ON sessions(refreshToken);
CREATE INDEX idx_sessions_expiresAt ON sessions(expiresAt);
```

---

### 2.3 板块表 (boards)

存储社区板块信息。

```sql
CREATE TABLE boards (
  id          VARCHAR(25) PRIMARY KEY,  -- CUID
  slug        VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(50) NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  order       INTEGER NOT NULL DEFAULT 0,
  isActive    BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | URL友好的标识符 |
| name | VARCHAR(50) | NOT NULL | 板块名称 |
| description | TEXT | NULLABLE | 板块描述 |
| icon | VARCHAR(50) | NULLABLE | 图标（emoji或icon名称） |
| order | INTEGER | NOT NULL | 排序顺序，数字越小越靠前 |
| isActive | BOOLEAN | NOT NULL | 是否激活 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| updatedAt | TIMESTAMP | NOT NULL | 更新时间 |

**预设数据:**

```sql
INSERT INTO boards (id, slug, name, description, icon, order) VALUES
  ('board001', 'check-in', '打卡板块', '每日学习打卡，记录成长足迹', '📅', 1),
  ('board002', 'learning', '学习分享', '分享学习资源和技术文章', '📚', 2),
  ('board003', 'career', '就业分享', '面试经验、求职心得、薪资分享', '💼', 3),
  ('board004', 'blog', '博客广场', '发布技术博客，展示个人实力', '✍️', 4);
```

**索引:**

```sql
CREATE INDEX idx_boards_slug ON boards(slug);
CREATE INDEX idx_boards_order ON boards(order);
CREATE INDEX idx_boards_isActive ON boards(isActive);
```

---

### 2.4 帖子表 (posts)

存储用户发布的帖子内容。

```sql
CREATE TABLE posts (
  id          VARCHAR(25) PRIMARY KEY,  -- CUID
  title       VARCHAR(200) NOT NULL,
  content     TEXT NOT NULL,
  excerpt     VARCHAR(500),
  coverImage  VARCHAR(500),
  slug        VARCHAR(200) UNIQUE,
  boardId     VARCHAR(25) NOT NULL,
  authorId    VARCHAR(25) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
  isPinned    BOOLEAN NOT NULL DEFAULT FALSE,
  isLocked    BOOLEAN NOT NULL DEFAULT FALSE,
  viewCount   INTEGER NOT NULL DEFAULT 0,
  likeCount   INTEGER NOT NULL DEFAULT 0,
  commentCount INTEGER NOT NULL DEFAULT 0,
  publishedAt TIMESTAMP,
  createdAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (boardId) REFERENCES boards(id) ON DELETE CASCADE,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| title | VARCHAR(200) | NOT NULL | 帖子标题 |
| content | TEXT | NOT NULL | 帖子内容（Markdown格式） |
| excerpt | VARCHAR(500) | NULLABLE | 摘要 |
| coverImage | VARCHAR(500) | NULLABLE | 封面图URL |
| slug | VARCHAR(200) | UNIQUE | URL友好的标识符 |
| boardId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 所属板块ID |
| authorId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 作者ID |
| status | VARCHAR(20) | NOT NULL | 状态: DRAFT, PUBLISHED, ARCHIVED |
| isPinned | BOOLEAN | NOT NULL | 是否置顶 |
| isLocked | BOOLEAN | NOT NULL | 是否锁定（禁止评论） |
| viewCount | INTEGER | NOT NULL | 浏览次数 |
| likeCount | INTEGER | NOT NULL | 点赞数（冗余字段） |
| commentCount | INTEGER | NOT NULL | 评论数（冗余字段） |
| publishedAt | TIMESTAMP | NULLABLE | 发布时间 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| updatedAt | TIMESTAMP | NOT NULL | 更新时间 |

**索引:**

```sql
CREATE INDEX idx_posts_boardId ON posts(boardId);
CREATE INDEX idx_posts_authorId ON posts(authorId);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_createdAt ON posts(createdAt);
CREATE INDEX idx_posts_publishedAt ON posts(publishedAt);
CREATE INDEX idx_posts_isPinned ON posts(isPinned);

-- 复合索引，用于列表查询
CREATE INDEX idx_posts_boardId_status_createdAt ON posts(boardId, status, createdAt DESC);
```

**全文搜索索引:**

```sql
CREATE INDEX idx_posts_fulltext ON posts USING GIN(to_tsvector('chinese', title || ' ' || content));
```

**枚举类型:**

```sql
CREATE TYPE post_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED');
```

---

### 2.5 评论表 (comments)

存储帖子的评论，支持嵌套回复。

```sql
CREATE TABLE comments (
  id        VARCHAR(25) PRIMARY KEY,  -- CUID
  content   TEXT NOT NULL,
  postId    VARCHAR(25) NOT NULL,
  authorId  VARCHAR(25) NOT NULL,
  parentId  VARCHAR(25),
  likeCount INTEGER NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parentId) REFERENCES comments(id) ON DELETE CASCADE
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| content | TEXT | NOT NULL | 评论内容，最多1000字 |
| postId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 关联帖子ID |
| authorId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 评论者ID |
| parentId | VARCHAR(25) | FOREIGN KEY | 父评论ID（NULL表示顶层评论） |
| likeCount | INTEGER | NOT NULL | 点赞数 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| updatedAt | TIMESTAMP | NOT NULL | 更新时间 |

**索引:**

```sql
CREATE INDEX idx_comments_postId ON comments(postId);
CREATE INDEX idx_comments_authorId ON comments(authorId);
CREATE INDEX idx_comments_parentId ON comments(parentId);
CREATE INDEX idx_comments_createdAt ON comments(createdAt);

-- 复合索引，用于查询帖子的评论
CREATE INDEX idx_comments_postId_createdAt ON comments(postId, createdAt DESC);
```

**嵌套评论查询（递归CTE）:**

```sql
WITH RECURSIVE comment_tree AS (
  -- 基础查询：顶层评论
  SELECT id, content, authorId, parentId, createdAt, 1 as level
  FROM comments
  WHERE postId = 'post123' AND parentId IS NULL

  UNION ALL

  -- 递归查询：子评论
  SELECT c.id, c.content, c.authorId, c.parentId, c.createdAt, ct.level + 1
  FROM comments c
  JOIN comment_tree ct ON c.parentId = ct.id
  WHERE ct.level < 3  -- 限制最多3层
)
SELECT * FROM comment_tree
ORDER BY createdAt;
```

---

### 2.6 点赞表 (likes)

存储用户对帖子的点赞记录。

```sql
CREATE TABLE likes (
  id        VARCHAR(25) PRIMARY KEY,  -- CUID
  userId    VARCHAR(25) NOT NULL,
  postId    VARCHAR(25) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (userId, postId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| userId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 用户ID |
| postId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 帖子ID |
| createdAt | TIMESTAMP | NOT NULL | 点赞时间 |

**唯一约束:** `(userId, postId)` - 每个用户对每个帖子只能点赞一次

**索引:**

```sql
CREATE INDEX idx_likes_userId ON likes(userId);
CREATE INDEX idx_likes_postId ON likes(postId);
CREATE INDEX idx_likes_createdAt ON likes(createdAt);
```

---

### 2.7 打卡表 (check_ins)

存储用户每日学习打卡记录。

```sql
CREATE TABLE check_ins (
  id          VARCHAR(25) PRIMARY KEY,  -- CUID
  userId      VARCHAR(25) NOT NULL,
  content     TEXT,
  studyHours  NUMERIC(5, 2) NOT NULL DEFAULT 0,
  learnings   TEXT[],
  checkInDate DATE NOT NULL,
  createdAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (userId, checkInDate),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| userId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 用户ID |
| content | TEXT | NULLABLE | 打卡内容，最多200字 |
| studyHours | NUMERIC(5,2) | NOT NULL | 学习时长（小时），精确到0.5 |
| learnings | TEXT[] | NULLABLE | 学习标签数组 |
| checkInDate | DATE | NOT NULL | 打卡日期 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |
| updatedAt | TIMESTAMP | NOT NULL | 更新时间 |

**唯一约束:** `(userId, checkInDate)` - 每个用户每天只能打卡一次

**索引:**

```sql
CREATE INDEX idx_check_ins_userId ON check_ins(userId);
CREATE INDEX idx_check_ins_checkInDate ON check_ins(checkInDate);
CREATE INDEX idx_check_ins_learnings ON check_ins USING GIN(learnings);

-- 复合索引，用于查询用户打卡历史
CREATE INDEX idx_check_ins_userId_checkInDate ON check_ins(userId, checkInDate DESC);
```

**连续打卡查询:**

```sql
WITH ranked_check_ins AS (
  SELECT
    userId,
    checkInDate,
    checkInDate - (ROW_NUMBER() OVER (PARTITION BY userId ORDER BY checkInDate))::INTEGER AS grp
  FROM check_ins
  WHERE userId = 'user123'
),
consecutive_groups AS (
  SELECT
    userId,
    COUNT(*) AS consecutive_days,
    MAX(checkInDate) AS last_date
  FROM ranked_check_ins
  GROUP BY userId, grp
  ORDER BY consecutive_days DESC
  LIMIT 1
)
SELECT consecutive_days FROM consecutive_groups;
```

---

### 2.8 通知表 (notifications)

存储用户通知消息。

```sql
CREATE TABLE notifications (
  id        VARCHAR(25) PRIMARY KEY,  -- CUID
  userId    VARCHAR(25) NOT NULL,
  type      VARCHAR(20) NOT NULL,
  title     VARCHAR(100) NOT NULL,
  content   TEXT NOT NULL,
  data      JSONB,
  isRead    BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| userId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 接收者ID |
| type | VARCHAR(20) | NOT NULL | 通知类型 |
| title | VARCHAR(100) | NOT NULL | 通知标题 |
| content | TEXT | NOT NULL | 通知内容 |
| data | JSONB | NULLABLE | 额外数据（如postId, commentId等） |
| isRead | BOOLEAN | NOT NULL | 是否已读 |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |

**枚举类型:**

```sql
CREATE TYPE notification_type AS ENUM ('COMMENT', 'REPLY', 'LIKE', 'MENTION', 'SYSTEM');
```

**索引:**

```sql
CREATE INDEX idx_notifications_userId ON notifications(userId);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_isRead ON notifications(isRead);
CREATE INDEX idx_notifications_createdAt ON notifications(createdAt);

-- 复合索引，用于查询用户未读通知
CREATE INDEX idx_notifications_userId_isRead_createdAt ON notifications(userId, isRead, createdAt DESC);
```

---

### 2.9 活动日志表 (activities)

记录用户操作日志，用于审计和统计。

```sql
CREATE TABLE activities (
  id          VARCHAR(25) PRIMARY KEY,  -- CUID
  userId      VARCHAR(25) NOT NULL,
  type        VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  metadata    JSONB,
  ipAddress   VARCHAR(45),
  userAgent   TEXT,
  createdAt   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**字段说明:**

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(25) | PRIMARY KEY | CUID格式的唯一标识 |
| userId | VARCHAR(25) | FOREIGN KEY, NOT NULL | 操作者ID |
| type | VARCHAR(50) | NOT NULL | 活动类型 |
| description | TEXT | NOT NULL | 活动描述 |
| metadata | JSONB | NULLABLE | 额外信息 |
| ipAddress | VARCHAR(45) | NULLABLE | IP地址（支持IPv6） |
| userAgent | TEXT | NULLABLE | 浏览器User-Agent |
| createdAt | TIMESTAMP | NOT NULL | 创建时间 |

**枚举类型:**

```sql
CREATE TYPE activity_type AS ENUM (
  'LOGIN', 'LOGOUT', 'REGISTER',
  'CREATE_POST', 'UPDATE_POST', 'DELETE_POST',
  'CREATE_COMMENT', 'UPDATE_COMMENT', 'DELETE_COMMENT',
  'LIKE_POST', 'UNLIKE_POST',
  'CHECK_IN',
  'BAN_USER', 'UNBAN_USER'
);
```

**索引:**

```sql
CREATE INDEX idx_activities_userId ON activities(userId);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_activities_createdAt ON activities(createdAt);

-- 复合索引，用于管理员查询日志
CREATE INDEX idx_activities_type_createdAt ON activities(type, createdAt DESC);
```

---

## 3. 数据库关系图（ER图）

```
┌─────────────┐
│   boards    │
│─────────────│
│ id (PK)     │
│ slug        │
│ name        │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────┐       ┌─────────────┐
│   posts     │ 1   N │   users     │
│─────────────│◄──────│─────────────│
│ id (PK)     │       │ id (PK)     │
│ boardId (FK)│ N 1   │ email       │
│ authorId(FK)│──────►│ username    │
└──────┬──────┘       │ role        │
       │              └──────┬──────┘
       │ 1                    │ 1
       │                      │
       │ N                    │ N
┌──────▼──────┐         ┌──────▼──────┐
│  comments   │         │  check_ins  │
│─────────────│         │─────────────│
│ id (PK)     │         │ id (PK)     │
│ postId (FK) │         │ userId (FK) │
│ authorId(FK)│         └─────────────┘
│ parentId(FK)│
└─────────────┘
       │ 1
       │
       │ N
┌──────▼──────┐
│   likes     │
│─────────────│
│ id (PK)     │
│ commentId FK│
└─────────────┘

┌─────────────┐
│ notifications│
│─────────────│
│ id (PK)     │
│ userId (FK) │◄──────┐
└─────────────┘       │
                      │
┌─────────────┐       │
│  activities │       │
│─────────────│       │
│ id (PK)     │       │
│ userId (FK) │───────┘
└─────────────┘
```

---

## 4. Prisma Schema

完整的Prisma Schema定义：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  FOUNDER
  ADMIN
  USER
}

enum UserStatus {
  ACTIVE
  BANNED
  DELETED
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  DELETED
}

enum NotificationType {
  COMMENT
  REPLY
  LIKE
  MENTION
  SYSTEM
}

enum ActivityType {
  LOGIN
  LOGOUT
  REGISTER
  CREATE_POST
  UPDATE_POST
  DELETE_POST
  CREATE_COMMENT
  UPDATE_COMMENT
  DELETE_COMMENT
  LIKE_POST
  UNLIKE_POST
  CHECK_IN
  BAN_USER
  UNBAN_USER
}

model User {
  id            String     @id @default(cuid())
  email         String     @unique
  username      String     @unique
  password      String
  avatar        String?
  bio           String?    @db.Text
  role          Role       @default(USER)
  status        UserStatus @default(ACTIVE)
  emailVerified Boolean    @default(false)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  // Relations
  posts         Post[]
  comments      Comment[]
  checkIns      CheckIn[]
  likes         Like[]
  notifications Notification[]
  activities    Activity[]
  sessions      Session[]

  @@index([email])
  @@index([username])
  @@index([role])
  @@index([status])
  @@index([createdAt])
  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  refreshToken String?  @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}

model Board {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String?  @db.Text
  icon        String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  posts Post[]

  @@index([slug])
  @@index([order])
  @@index([isActive])
  @@map("boards")
}

model Post {
  id          String     @id @default(cuid())
  title       String
  content     String     @db.Text
  excerpt     String?
  coverImage  String?
  slug        String?    @unique
  boardId     String
  authorId    String
  status      PostStatus @default(PUBLISHED)
  isPinned    Boolean    @default(false)
  isLocked    Boolean    @default(false)
  viewCount   Int        @default(0)
  likeCount   Int        @default(0)
  commentCount Int       @default(0)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  board      Board      @relation(fields: [boardId], references: [id], onDelete: Cascade)
  author     User       @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments   Comment[]
  likes      Like[]

  @@index([boardId])
  @@index([authorId])
  @@index([status])
  @@index([slug])
  @@index([createdAt])
  @@index([publishedAt])
  @@index([isPinned])
  @@index([boardId, status, createdAt(sort: Desc)])
  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  postId    String
  authorId  String
  parentId  String?
  likeCount Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  post   Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  author User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  parent Comment? @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies Comment[] @relation("CommentReplies")

  @@index([postId])
  @@index([authorId])
  @@index([parentId])
  @@index([createdAt])
  @@index([postId, createdAt(sort: Desc)])
  @@map("comments")
}

model Like {
  id        String   @id @default(cuid())
  userId    String
  postId    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  post Post @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
  @@index([userId])
  @@index([postId])
  @@index([createdAt])
  @@map("likes")
}

model CheckIn {
  id          String   @id @default(cuid())
  userId      String
  content     String?  @db.Text
  studyHours  Float    @default(0) @db.Numeric(5, 2)
  learnings   String[]
  checkInDate DateTime @db.Date
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, checkInDate])
  @@index([userId])
  @@index([checkInDate])
  @@index([learnings], type: Gin)
  @@index([userId, checkInDate(sort: Desc)])
  @@map("check_ins")
}

model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  content   String           @db.Text
  data      Json?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
  @@index([isRead])
  @@index([createdAt])
  @@index([userId, isRead, createdAt(sort: Desc)])
  @@map("notifications")
}

model Activity {
  id          String       @id @default(cuid())
  userId      String
  type        ActivityType
  description String       @db.Text
  metadata    Json?
  ipAddress   String?      @db.VarChar(45)
  userAgent   String?      @db.Text
  createdAt   DateTime     @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([type])
  @@index([createdAt])
  @@index([type, createdAt(sort: Desc)])
  @@map("activities")
}
```

---

## 5. 数据库优化

### 5.1 索引优化策略

**主键索引:** 所有表都有主键索引（通常是id字段）

**唯一索引:** email, username等唯一字段

**单列索引:** 频繁查询的字段

**复合索引:** 多字段组合查询，遵循最左前缀原则

**GIN索引:** 数组字段（learnings）和全文搜索

### 5.2 查询优化

**分页查询:** 使用LIMIT + OFFSET

**热门帖子查询:**

```sql
-- 使用复合索引优化
SELECT * FROM posts
WHERE boardId = 'board123' AND status = 'PUBLISHED'
ORDER BY likeCount DESC
LIMIT 20;
```

**全文搜索:**

```sql
-- 使用全文索引
SELECT * FROM posts
WHERE to_tsvector('chinese', title || ' ' || content) @@ to_tsquery('chinese', 'React & 18');
```

### 5.3 缓存策略

**Redis缓存:**

- 热门帖子列表（5分钟）
- 板块信息（30分钟）
- 用户统计数据（1小时）
- 排行榜（10分钟）

**缓存键命名规范:**

```
posts:hot:{boardId}
board:info:{boardId}
user:stats:{userId}
leaderboard:consecutive
```

---

## 6. 数据迁移

### 6.1 迁移文件管理

使用Prisma Migrate管理：

```bash
# 创建迁移
npx prisma migrate dev --name init

# 应用迁移
npx prisma migrate deploy

# 重置数据库（开发环境）
npx prisma migrate reset
```

### 6.2 种子数据

创建种子数据文件 `prisma/seed.ts`：

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建创始人账号
  await prisma.user.upsert({
    where: { email: 'admin@framezero.com' },
    update: {},
    create: {
      email: 'admin@framezero.com',
      username: 'admin',
      password: '$2b$10$...',  // bcrypt加密后的 Admin123!
      role: 'FOUNDER',
      emailVerified: true,
    },
  });

  // 创建测试用户
  await prisma.user.upsert({
    where: { email: 'user@framezero.com' },
    update: {},
    create: {
      email: 'user@framezero.com',
      username: 'testuser',
      password: '$2b$10$...',  // bcrypt加密后的 User123!
      role: 'USER',
      emailVerified: true,
    },
  });

  // 创建板块
  await prisma.board.createMany({
    data: [
      { slug: 'check-in', name: '打卡板块', description: '每日学习打卡', icon: '📅', order: 1 },
      { slug: 'learning', name: '学习分享', description: '分享学习资源', icon: '📚', order: 2 },
      { slug: 'career', name: '就业分享', description: '面试经验分享', icon: '💼', order: 3 },
      { slug: 'blog', name: '博客广场', description: '技术博客', icon: '✍️', order: 4 },
    ],
  });
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
```

运行种子数据：

```bash
npx prisma db seed
```

---

## 7. 数据备份与恢复

### 7.1 备份策略

**每日全量备份:**

```bash
pg_dump -U postgres -d frame_zero > backup_$(date +%Y%m%d).sql
```

**每小时增量备份:**

```bash
pg_dump -U postgres -d frame_zero --format=directory --file=/backups/incremental_$(date +%Y%m%d_%H%M)
```

### 7.2 恢复数据

```bash
psql -U postgres -d frame_zero < backup_20260123.sql
```

### 7.3 自动化备份脚本

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="frame_zero"
DB_USER="postgres"

# 全量备份
pg_dump -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/full_$DATE.sql.gz

# 保留最近30天的备份
find $BACKUP_DIR -name "full_*.sql.gz" -mtime +30 -delete
```

设置定时任务（crontab）：

```
0 2 * * * /path/to/backup.sh
```

---

## 8. 数据库监控

### 8.1 性能监控

**慢查询日志:**

```sql
-- 启用慢查询日志
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- 1秒
SELECT pg_reload_conf();
```

**查询统计:**

```sql
-- 查看最慢的查询
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### 8.2 连接监控

```sql
-- 查看当前连接
SELECT * FROM pg_stat_activity WHERE datname = 'frame_zero';

-- 查看连接数
SELECT count(*) FROM pg_stat_activity WHERE datname = 'frame_zero';
```

### 8.3 表大小监控

```sql
-- 查看表大小
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 9. 安全建议

### 9.1 数据库安全

- 使用强密码（至少16位，包含大小写字母、数字、特殊字符）
- 限制数据库访问IP
- 使用SSL连接
- 定期更新PostgreSQL版本

### 9.2 数据加密

- **密码加密:** bcrypt，salt rounds = 10
- **敏感数据:** 考虑使用pgcrypto加密
- **传输加密:** 强制SSL/TLS

### 9.3 权限管理

```sql
-- 创建只读用户
CREATE USER readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE frame_zero TO readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

-- 创建应用用户
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE frame_zero TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

---

## 10. 附录

### 10.1 常用SQL查询

**获取用户统计:**

```sql
SELECT
  role,
  status,
  COUNT(*) as count
FROM users
GROUP BY role, status;
```

**获取热门帖子:**

```sql
SELECT
  p.title,
  p.likeCount,
  p.commentCount,
  p.viewCount,
  u.username,
  b.name as board_name
FROM posts p
JOIN users u ON p.authorId = u.id
JOIN boards b ON p.boardId = b.id
WHERE p.status = 'PUBLISHED'
ORDER BY (p.likeCount * 2 + p.commentCount + p.viewCount / 10) DESC
LIMIT 20;
```

**获取打卡排行榜:**

```sql
WITH user_checkins AS (
  SELECT
    userId,
    COUNT(*) as total_days,
    MAX(checkInDate) as last_checkin
  FROM check_ins
  GROUP BY userId
)
SELECT
  u.username,
  u.avatar,
  uc.total_days,
  ROW_NUMBER() OVER (ORDER BY uc.total_days DESC) as rank
FROM user_checkins uc
JOIN users u ON uc.userId = u.id
ORDER BY uc.total_days DESC
LIMIT 100;
```

### 10.2 数据库清理

**删除软删除的数据（30天前）:**

```sql
DELETE FROM posts
WHERE status = 'DELETED' AND updatedAt < NOW() - INTERVAL '30 days';
```

**清理过期会话:**

```sql
DELETE FROM sessions
WHERE expiresAt < NOW();
```

---

## 版本历史

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|----------|--------|
| v1.0 | 2026-01-23 | 初始版本，完成数据库设计 | - |
