# Frame Zero - API接口文档

## 1. 通用规范

### 1.1 Base URL

```
开发环境: http://localhost:3000/api
生产环境: https://api.framezero.com/api
```

### 1.2 认证方式

**JWT Bearer Token**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token类型:**
- **Access Token:** 15分钟有效期，用于API调用
- **Refresh Token:** 7天有效期，用于刷新Access Token

**Token获取:** 登录或注册接口返回

### 1.3 请求格式

- **Content-Type:** `application/json`
- **字符编码:** `UTF-8`
- **HTTP方法:** GET, POST, PATCH, DELETE

### 1.4 响应格式

**成功响应:**
```json
{
  "data": { /* 响应数据 */ },
  "meta": {  // 可选，分页信息
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

**错误响应:**
```json
{
  "statusCode": 400,
  "message": "错误描述",
  "error": "Bad Request",
  "errors": [  // 可选，详细错误信息
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
```

### 1.5 错误码规范

| 错误码 | 说明 | 示例 |
|-------|------|------|
| 400 | 请求参数错误 | 缺少必填字段、格式错误 |
| 401 | 未认证 | Token缺失或无效 |
| 403 | 无权限 | 权限不足 |
| 404 | 资源不存在 | 帖子/用户不存在 |
| 409 | 资源冲突 | 邮箱已注册、重复打卡 |
| 422 | 数据验证失败 | 业务规则验证失败 |
| 429 | 请求过于频繁 | 触发限流 |
| 500 | 服务器内部错误 | 服务器异常 |

### 1.6 通用Header

```http
User-Agent: FrameZero/1.0
Accept: application/json
Authorization: Bearer <token>
```

### 1.7 分页参数

**Query参数:**
```
page: 页码（默认1）
limit: 每页数量（默认20，最大100）
```

**示例:**
```
GET /api/posts?page=2&limit=10
```

---

## 2. 认证接口

### 2.1 用户注册

**接口:** `POST /auth/register`

**是否需要认证:** ❌

**权限要求:** 无

**请求参数:**
```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

**参数说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | ✅ | 邮箱地址，唯一 |
| username | string | ✅ | 用户名，3-20字符，唯一 |
| password | string | ✅ | 密码，8位以上，包含字母和数字 |

**响应示例 (201 Created):**
```json
{
  "data": {
    "user": {
      "id": "clxxxxxxx",
      "email": "user@example.com",
      "username": "john_doe",
      "role": "USER",
      "avatar": null,
      "bio": null,
      "createdAt": "2026-01-23T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

**错误示例 (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

### 2.2 用户登录

**接口:** `POST /auth/login`

**是否需要认证:** ❌

**权限要求:** 无

**请求参数:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**参数说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | ✅ | 邮箱地址 |
| password | string | ✅ | 密码 |

**响应示例 (200 OK):**
```json
{
  "data": {
    "user": {
      "id": "clxxxxxxx",
      "email": "user@example.com",
      "username": "john_doe",
      "role": "USER",
      "avatar": "/uploads/avatars/clxxxxxxx.jpg",
      "bio": "全栈开发者",
      "createdAt": "2026-01-23T10:00:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

**错误示例 (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### 2.3 刷新Token

**接口:** `POST /auth/refresh`

**是否需要认证:** ❌

**权限要求:** 无

**请求参数:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应示例 (200 OK):**
```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 900
  }
}
```

---

### 2.4 用户登出

**接口:** `POST /auth/logout`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**请求参数:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应示例 (200 OK):**
```json
{
  "data": {
    "message": "Successfully logged out"
  }
}
```

---

### 2.5 获取当前用户

**接口:** `GET /auth/me`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "clxxxxxxx",
    "email": "user@example.com",
    "username": "john_doe",
    "role": "USER",
    "avatar": "/uploads/avatars/clxxxxxxx.jpg",
    "bio": "全栈开发者",
    "emailVerified": true,
    "status": "ACTIVE",
    "createdAt": "2026-01-23T10:00:00.000Z",
    "statistics": {
      "postsCount": 25,
      "commentsCount": 150,
      "likesCount": 89,
      "checkInDays": 30
    }
  }
}
```

---

## 3. 用户接口

### 3.1 获取用户资料

**接口:** `GET /users/:id`

**是否需要认证:** ❌

**权限要求:** 无

**路径参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 用户ID |

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "clxxxxxxx",
    "username": "john_doe",
    "avatar": "/uploads/avatars/clxxxxxxx.jpg",
    "bio": "全栈开发者",
    "role": "USER",
    "createdAt": "2026-01-23T10:00:00.000Z",
    "statistics": {
      "postsCount": 25,
      "commentsCount": 150,
      "likesReceived": 89,
      "checkInDays": 30,
      "consecutiveCheckInDays": 5
    }
  }
}
```

---

### 3.2 更新用户资料

**接口:** `PATCH /users/me`

**是否需要认证:** ✅

**权限要求:** 所有登录用户（只能修改自己）

**请求参数:**
```json
{
  "username": "john_doe_new",
  "bio": "新的个人简介",
  "avatar": "data:image/jpeg;base64,..."
}
```

**参数说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | ❌ | 用户名 |
| bio | string | ❌ | 个人简介，最多500字 |
| avatar | string | ❌ | Base64编码的图片 |

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "clxxxxxxx",
    "username": "john_doe_new",
    "bio": "新的个人简介",
    "avatar": "/uploads/avatars/clxxxxxxx_new.jpg",
    "updatedAt": "2026-01-23T12:00:00.000Z"
  }
}
```

---

### 3.3 修改密码

**接口:** `PATCH /users/me/password`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**请求参数:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**响应示例 (200 OK):**
```json
{
  "data": {
    "message": "Password updated successfully"
  }
}
```

**错误示例 (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Current password is incorrect",
  "error": "Unauthorized"
}
```

---

## 4. 板块接口

### 4.1 获取所有板块

**接口:** `GET /boards`

**是否需要认证:** ❌

**权限要求:** 无

**Query参数:**
```
isActive: boolean (可选，默认true，是否只返回激活的板块)
```

**响应示例 (200 OK):**
```json
{
  "data": [
    {
      "id": "clxxxxxxx",
      "slug": "check-in",
      "name": "打卡板块",
      "description": "每日学习打卡，记录成长足迹",
      "icon": "📅",
      "order": 1,
      "isActive": true,
      "postsCount": 1250,
      "createdAt": "2026-01-23T10:00:00.000Z"
    },
    {
      "id": "clyyyyyyy",
      "slug": "learning",
      "name": "学习分享",
      "description": "分享学习资源和技术文章",
      "icon": "📚",
      "order": 2,
      "isActive": true,
      "postsCount": 890,
      "createdAt": "2026-01-23T10:00:00.000Z"
    }
  ]
}
```

---

### 4.2 获取板块详情

**接口:** `GET /boards/:slug`

**是否需要认证:** ❌

**权限要求:** 无

**路径参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| slug | string | 板块标识 |

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "clxxxxxxx",
    "slug": "learning",
    "name": "学习分享",
    "description": "分享学习资源和技术文章",
    "icon": "📚",
    "order": 2,
    "isActive": true,
    "postsCount": 890,
    "createdAt": "2026-01-23T10:00:00.000Z",
    "latestPosts": [
      {
        "id": "post123",
        "title": "React 18新特性详解",
        "excerpt": "React 18带来了许多新特性...",
        "author": {
          "username": "john_doe"
        },
        "createdAt": "2026-01-23T12:00:00.000Z"
      }
    ]
  }
}
```

---

## 5. 帖子接口

### 5.1 获取帖子列表

**接口:** `GET /posts`

**是否需要认证:** ❌

**权限要求:** 无

**Query参数:**
```
page: number (可选，默认1)
limit: number (可选，默认20，最大100)
boardId: string (可选，筛选板块)
search: string (可选，搜索关键词)
sort: string (可选，排序方式: latest | popular | mostLiked | mostCommented，默认latest)
```

**示例:**
```
GET /api/posts?page=1&limit=10&boardId=clxxxxxxx&search=React&sort=popular
```

**响应示例 (200 OK):**
```json
{
  "data": [
    {
      "id": "post123",
      "title": "React 18新特性详解",
      "excerpt": "React 18带来了许多新特性，包括并发渲染、自动批处理等...",
      "coverImage": "/uploads/covers/post123.jpg",
      "author": {
        "id": "user123",
        "username": "john_doe",
        "avatar": "/uploads/avatars/user123.jpg"
      },
      "board": {
        "id": "board123",
        "name": "学习分享",
        "slug": "learning",
        "icon": "📚"
      },
      "status": "PUBLISHED",
      "isPinned": false,
      "isLocked": false,
      "viewCount": 1520,
      "likeCount": 89,
      "commentCount": 25,
      "createdAt": "2026-01-23T12:00:00.000Z",
      "updatedAt": "2026-01-23T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 125,
    "page": 1,
    "limit": 10,
    "totalPages": 13
  }
}
```

---

### 5.2 获取帖子详情

**接口:** `GET /posts/:id`

**是否需要认证:** ❌

**权限要求:** 无

**路径参数:**
| 参数 | 类型 | 说明 |
|------|------|------|
| id | string | 帖子ID |

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "post123",
    "title": "React 18新特性详解",
    "content": "# React 18新特性\n\nReact 18带来了许多新特性...",
    "excerpt": "React 18带来了许多新特性，包括并发渲染、自动批处理等...",
    "coverImage": "/uploads/covers/post123.jpg",
    "author": {
      "id": "user123",
      "username": "john_doe",
      "avatar": "/uploads/avatars/user123.jpg",
      "bio": "全栈开发者"
    },
    "board": {
      "id": "board123",
      "name": "学习分享",
      "slug": "learning",
      "icon": "📚"
    },
    "status": "PUBLISHED",
    "isPinned": false,
    "isLocked": false,
    "viewCount": 1520,
    "likeCount": 89,
    "commentCount": 25,
    "isLiked": false,  // 当前用户是否已点赞
    "createdAt": "2026-01-23T12:00:00.000Z",
    "updatedAt": "2026-01-23T12:00:00.000Z",
    "publishedAt": "2026-01-23T12:00:00.000Z"
  }
}
```

---

### 5.3 创建帖子

**接口:** `POST /posts`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**请求参数:**
```json
{
  "title": "我的第一篇博客",
  "content": "# Hello World\n\n这是我的第一篇博客...",
  "boardId": "board123",
  "excerpt": "这是摘要",
  "coverImage": "https://example.com/cover.jpg",
  "status": "PUBLISHED"
}
```

**参数说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | ✅ | 标题，最多200字 |
| content | string | ✅ | 内容（Markdown格式） |
| boardId | string | ✅ | 板块ID |
| excerpt | string | ❌ | 摘要，最多500字 |
| coverImage | string | ❌ | 封面图URL |
| status | string | ❌ | 状态: DRAFT | PUBLISHED，默认PUBLISHED |

**响应示例 (201 Created):**
```json
{
  "data": {
    "id": "post456",
    "title": "我的第一篇博客",
    "slug": "wo-de-di-yi-pian-bo-ke",
    "status": "PUBLISHED",
    "author": {
      "id": "user123",
      "username": "john_doe"
    },
    "createdAt": "2026-01-23T14:00:00.000Z"
  }
}
```

---

### 5.4 更新帖子

**接口:** `PATCH /posts/:id`

**是否需要认证:** ✅

**权限要求:**
- 帖子作者（只能编辑自己的帖子）
- 管理员
- 创始人

**资源所有权检查:** ✅

**请求参数:**
```json
{
  "title": "更新后的标题",
  "content": "更新后的内容...",
  "excerpt": "更新后的摘要",
  "coverImage": "https://example.com/new-cover.jpg",
  "status": "PUBLISHED"
}
```

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "post456",
    "title": "更新后的标题",
    "slug": "wo-de-di-yi-pian-bo-ke",
    "status": "PUBLISHED",
    "updatedAt": "2026-01-23T15:00:00.000Z"
  }
}
```

**错误示例 (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "You don't have permission to update this post",
  "error": "Forbidden"
}
```

---

### 5.5 删除帖子

**接口:** `DELETE /posts/:id`

**是否需要认证:** ✅

**权限要求:**
- 创始人（可删除任意帖子）
- 管理员（可删除普通用户的帖子）
- 用户（只能删除自己的帖子）

**资源所有权检查:** ✅

**响应示例 (200 OK):**
```json
{
  "data": {
    "message": "Post deleted successfully"
  }
}
```

---

### 5.6 点赞/取消点赞帖子

**接口:** `POST /posts/:id/like`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**响应示例 (200 OK):**
```json
{
  "data": {
    "isLiked": true,
    "likeCount": 90
  }
}
```

---

## 6. 评论接口

### 6.1 获取帖子评论

**接口:** `GET /posts/:postId/comments`

**是否需要认证:** ❌

**权限要求:** 无

**Query参数:**
```
page: number (可选，默认1)
limit: number (可选，默认20)
sort: string (可选，排序方式: latest | popular，默认latest)
```

**响应示例 (200 OK):**
```json
{
  "data": [
    {
      "id": "comment123",
      "content": "非常好的分享！学到了很多",
      "author": {
        "id": "user456",
        "username": "jane_smith",
        "avatar": "/uploads/avatars/user456.jpg"
      },
      "parentId": null,
      "postId": "post123",
      "likeCount": 15,
      "replyCount": 3,
      "createdAt": "2026-01-23T13:00:00.000Z",
      "updatedAt": "2026-01-23T13:00:00.000Z",
      "replies": [
        {
          "id": "comment124",
          "content": "感谢支持！",
          "author": {
            "id": "user123",
            "username": "john_doe"
          },
          "parentId": "comment123",
          "likeCount": 5,
          "createdAt": "2026-01-23T13:30:00.000Z"
        }
      ]
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

---

### 6.2 创建评论

**接口:** `POST /posts/:postId/comments`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**请求参数:**
```json
{
  "content": "非常好的分享！",
  "parentId": null
}
```

**参数说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | ✅ | 评论内容，最多1000字 |
| parentId | string | ❌ | 父评论ID（回复评论时填写） |

**响应示例 (201 Created):**
```json
{
  "data": {
    "id": "comment125",
    "content": "非常好的分享！",
    "author": {
      "id": "user789",
      "username": "bob_wilson"
    },
    "parentId": null,
    "createdAt": "2026-01-23T16:00:00.000Z"
  }
}
```

---

### 6.3 更新评论

**接口:** `PATCH /comments/:id`

**是否需要认证:** ✅

**权限要求:**
- 评论作者（只能编辑自己的评论）
- 管理员
- 创始人

**资源所有权检查:** ✅

**请求参数:**
```json
{
  "content": "更新后的评论内容"
}
```

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "comment125",
    "content": "更新后的评论内容",
    "updatedAt": "2026-01-23T17:00:00.000Z"
  }
}
```

---

### 6.4 删除评论

**接口:** `DELETE /comments/:id`

**是否需要认证:** ✅

**权限要求:**
- 创始人（可删除任意评论）
- 管理员（可删除普通用户的评论）
- 用户（只能删除自己的评论）

**资源所有权检查:** ✅

**响应示例 (200 OK):**
```json
{
  "data": {
    "message": "Comment deleted successfully"
  }
}
```

---

### 6.5 点赞/取消点赞评论

**接口:** `POST /comments/:id/like`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**响应示例 (200 OK):**
```json
{
  "data": {
    "isLiked": true,
    "likeCount": 16
  }
}
```

---

## 7. 打卡接口

### 7.1 今日打卡

**接口:** `POST /check-ins`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**限制:** 每用户每天只能打卡一次

**请求参数:**
```json
{
  "content": "今天学习了Python基础语法和列表推导式",
  "studyHours": 3.5,
  "learnings": ["Python", "基础语法", "列表推导式"]
}
```

**参数说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | ✅ | 打卡内容，最多200字 |
| studyHours | number | ❌ | 学习时长（小时），可精确到0.5 |
| learnings | array | ❌ | 学习标签，最多5个 |

**响应示例 (201 Created):**
```json
{
  "data": {
    "id": "checkin123",
    "checkInDate": "2026-01-23T00:00:00.000Z",
    "content": "今天学习了Python基础语法和列表推导式",
    "studyHours": 3.5,
    "learnings": ["Python", "基础语法", "列表推导式"],
    "consecutiveDays": 5,
    "totalDays": 30,
    "createdAt": "2026-01-23T18:00:00.000Z"
  }
}
```

**错误示例 (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "Already checked in today",
  "error": "Forbidden"
}
```

---

### 7.2 获取今日打卡状态

**接口:** `GET /check-ins/today`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**响应示例 (200 OK):**

**已打卡:**
```json
{
  "data": {
    "hasCheckedIn": true,
    "checkIn": {
      "id": "checkin123",
      "content": "今天学习了Python基础语法",
      "studyHours": 3.5,
      "checkInDate": "2026-01-23T00:00:00.000Z",
      "createdAt": "2026-01-23T18:00:00.000Z"
    },
    "consecutiveDays": 5,
    "totalDays": 30
  }
}
```

**未打卡:**
```json
{
  "data": {
    "hasCheckedIn": false,
    "checkIn": null,
    "consecutiveDays": 4,
    "totalDays": 29
  }
}
```

---

### 7.3 获取打卡历史

**接口:** `GET /check-ins/history`

**是否需要认证:** ✅

**权限要求:** 所有登录用户（只能查看自己的历史）

**Query参数:**
```
page: number (可选，默认1)
limit: number (可选，默认20)
userId: string (可选，管理员可查看其他用户)
startDate: string (可选，格式: YYYY-MM-DD)
endDate: string (可选，格式: YYYY-MM-DD)
```

**响应示例 (200 OK):**
```json
{
  "data": [
    {
      "id": "checkin123",
      "content": "今天学习了Python基础语法",
      "studyHours": 3.5,
      "learnings": ["Python", "基础语法"],
      "checkInDate": "2026-01-23T00:00:00.000Z",
      "createdAt": "2026-01-23T18:00:00.000Z"
    },
    {
      "id": "checkin122",
      "content": "学习了React Hooks",
      "studyHours": 2.0,
      "learnings": ["React", "Hooks"],
      "checkInDate": "2026-01-22T00:00:00.000Z",
      "createdAt": "2026-01-22T20:00:00.000Z"
    }
  ],
  "meta": {
    "total": 30,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  }
}
```

---

### 7.4 获取打卡排行榜

**接口:** `GET /check-ins/leaderboard`

**是否需要认证:** ❌

**权限要求:** 无

**Query参数:**
```
type: string (可选，排序类型: consecutive | total | weekly | monthly，默认consecutive)
limit: number (可选，返回数量，默认100)
```

**响应示例 (200 OK):**
```json
{
  "data": [
    {
      "rank": 1,
      "user": {
        "id": "user001",
        "username": "coding_master",
        "avatar": "/uploads/avatars/user001.jpg"
      },
      "value": 365,
      "valueLabel": "连续365天"
    },
    {
      "rank": 2,
      "user": {
        "id": "user002",
        "username": "python_lover",
        "avatar": "/uploads/avatars/user002.jpg"
      },
      "value": 200,
      "valueLabel": "连续200天"
    },
    {
      "rank": 3,
      "user": {
        "id": "user003",
        "username": "react_dev",
        "avatar": "/uploads/avatars/user003.jpg"
      },
      "value": 150,
      "valueLabel": "连续150天"
    }
  ],
  "meta": {
    "type": "consecutive",
    "totalUsers": 1250,
    "myRank": {
      "rank": 25,
      "value": 30,
      "valueLabel": "连续30天"
    }
  }
}
```

---

## 8. 通知接口

### 8.1 获取通知列表

**接口:** `GET /notifications`

**是否需要认证:** ✅

**权限要求:** 所有登录用户（只能查看自己的通知）

**Query参数:**
```
page: number (可选，默认1)
limit: number (可选，默认20)
isRead: boolean (可选，筛选已读/未读)
type: string (可选，通知类型: COMMENT | REPLY | LIKE | MENTION | SYSTEM)
```

**响应示例 (200 OK):**
```json
{
  "data": [
    {
      "id": "notif123",
      "type": "COMMENT",
      "title": "新评论",
      "content": "john_doe 评论了你的帖子《React 18新特性详解》",
      "data": {
        "postId": "post123",
        "commentId": "comment456",
        "commenterUsername": "john_doe"
      },
      "isRead": false,
      "createdAt": "2026-01-23T19:00:00.000Z"
    },
    {
      "id": "notif122",
      "type": "LIKE",
      "title": "收到点赞",
      "content": "jane_smith 赞了你的评论",
      "data": {
        "commentId": "comment789",
        "likerUsername": "jane_smith"
      },
      "isRead": true,
      "createdAt": "2026-01-23T18:00:00.000Z"
    }
  ],
  "meta": {
    "total": 50,
    "unreadCount": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### 8.2 标记通知为已读

**接口:** `PATCH /notifications/:id/read`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "notif123",
    "isRead": true
  }
}
```

---

### 8.3 批量标记已读

**接口:** `POST /notifications/read-all`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**响应示例 (200 OK):**
```json
{
  "data": {
    "message": "All notifications marked as read",
    "count": 15
  }
}
```

---

### 8.4 删除通知

**接口:** `DELETE /notifications/:id`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**响应示例 (200 OK):**
```json
{
  "data": {
    "message": "Notification deleted successfully"
  }
}
```

---

## 9. 管理员接口

### 9.1 获取用户列表

**接口:** `GET /admin/users`

**是否需要认证:** ✅

**权限要求:** 管理员、创始人

**Query参数:**
```
page: number (可选，默认1)
limit: number (可选，默认20)
search: string (可选，搜索用户名或邮箱)
role: string (可选，筛选角色: FOUNDER | ADMIN | USER)
status: string (可选，筛选状态: ACTIVE | BANNED | DELETED)
```

**响应示例 (200 OK):**
```json
{
  "data": [
    {
      "id": "user123",
      "email": "user@example.com",
      "username": "john_doe",
      "role": "USER",
      "status": "ACTIVE",
      "avatar": "/uploads/avatars/user123.jpg",
      "postsCount": 25,
      "commentsCount": 150,
      "createdAt": "2026-01-23T10:00:00.000Z",
      "lastLoginAt": "2026-01-23T18:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1250,
    "page": 1,
    "limit": 20,
    "totalPages": 63
  }
}
```

---

### 9.2 封禁/解封用户

**接口:** `PATCH /admin/users/:id/status`

**是否需要认证:** ✅

**权限要求:** 创始人

**请求参数:**
```json
{
  "status": "BANNED",
  "reason": "发布违规内容"
}
```

**参数说明:**
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | string | ✅ | 状态: ACTIVE | BANNED |
| reason | string | ❌ | 封禁原因 |

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "user123",
    "status": "BANNED",
    "updatedAt": "2026-01-23T20:00:00.000Z"
  }
}
```

---

### 9.3 获取系统统计

**接口:** `GET /admin/statistics`

**是否需要认证:** ✅

**权限要求:** 管理员、创始人

**Query参数:**
```
period: string (可选，时间周期: today | week | month | year，默认today)
```

**响应示例 (200 OK):**
```json
{
  "data": {
    "period": "today",
    "users": {
      "total": 1250,
      "new": 15,
      "active": 89
    },
    "posts": {
      "total": 5680,
      "new": 25,
      "published": 5200,
      "draft": 480
    },
    "comments": {
      "total": 15800,
      "new": 125
    },
    "checkIns": {
      "total": 8500,
      "today": 89,
      "uniqueUsers": 85
    },
    "engagement": {
      "totalLikes": 15800,
      "totalViews": 125000
    }
  },
  "meta": {
    "generatedAt": "2026-01-23T20:00:00.000Z"
  }
}
```

---

### 9.4 管理板块

**接口:** `POST /admin/boards`

**是否需要认证:** ✅

**权限要求:** 创始人、管理员

**请求参数:**
```json
{
  "slug": "new-board",
  "name": "新板块",
  "description": "这是一个新板块",
  "icon": "🎉",
  "order": 5
}
```

**响应示例 (201 Created):**
```json
{
  "data": {
    "id": "board456",
    "slug": "new-board",
    "name": "新板块",
    "description": "这是一个新板块",
    "icon": "🎉",
    "order": 5,
    "isActive": true,
    "createdAt": "2026-01-23T21:00:00.000Z"
  }
}
```

---

### 9.5 更新板块

**接口:** `PATCH /admin/boards/:id`

**是否需要认证:** ✅

**权限要求:** 创始人、管理员

**请求参数:**
```json
{
  "name": "更新后的板块名",
  "description": "更新后的描述",
  "icon": "🚀",
  "order": 6,
  "isActive": true
}
```

**响应示例 (200 OK):**
```json
{
  "data": {
    "id": "board456",
    "slug": "new-board",
    "name": "更新后的板块名",
    "description": "更新后的描述",
    "icon": "🚀",
    "order": 6,
    "isActive": true,
    "updatedAt": "2026-01-23T22:00:00.000Z"
  }
}
```

---

### 9.6 获取活动日志

**接口:** `GET /admin/activity-logs`

**是否需要认证:** ✅

**权限要求:** 创始人

**Query参数:**
```
page: number (可选，默认1)
limit: number (可选，默认50)
userId: string (可选，筛选用户)
type: string (可选，活动类型: LOGIN | LOGOUT | CREATE_POST | DELETE_POST 等)
startDate: string (可选，开始日期 YYYY-MM-DD)
endDate: string (可选，结束日期 YYYY-MM-DD)
```

**响应示例 (200 OK):**
```json
{
  "data": [
    {
      "id": "log123",
      "user": {
        "id": "user123",
        "username": "john_doe"
      },
      "type": "CREATE_POST",
      "description": "创建了帖子《我的第一篇博客》",
      "metadata": {
        "postId": "post456"
      },
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2026-01-23T14:00:00.000Z"
    },
    {
      "id": "log122",
      "user": {
        "id": "user123",
        "username": "john_doe"
      },
      "type": "LOGIN",
      "description": "用户登录",
      "metadata": null,
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2026-01-23T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 5680,
    "page": 1,
    "limit": 50,
    "totalPages": 114
  }
}
```

---

## 10. 文件上传接口

### 10.1 上传图片

**接口:** `POST /upload/image`

**是否需要认证:** ✅

**权限要求:** 所有登录用户

**请求格式:** `multipart/form-data`

**表单字段:**
```
file: File (必填，图片文件)
type: string (必填，图片类型: avatar | cover | content)
```

**文件限制:**
- 支持格式: JPG, PNG, GIF, WebP
- 最大大小: 2MB
- Avatar尺寸: 自动裁剪为正方形

**响应示例 (201 Created):**
```json
{
  "data": {
    "url": "/uploads/images/2026/01/23/image123.jpg",
    "filename": "image123.jpg",
    "size": 256000,
    "width": 1920,
    "height": 1080,
    "type": "cover"
  }
}
```

**错误示例 (422 Unprocessable Entity):**
```json
{
  "statusCode": 422,
  "message": "File size exceeds maximum allowed size of 2MB",
  "error": "Unprocessable Entity"
}
```

---

## 11. 搜索接口

### 11.1 全局搜索

**接口:** `GET /search`

**是否需要认证:** ❌

**权限要求:** 无

**Query参数:**
```
q: string (必填，搜索关键词)
type: string (可选，搜索类型: all | posts | users | boards，默认all)
page: number (可选，默认1)
limit: number (可选，默认20)
```

**响应示例 (200 OK):**
```json
{
  "data": {
    "posts": {
      "total": 25,
      "results": [
        {
          "id": "post123",
          "title": "React 18新特性详解",
          "excerpt": "React 18带来了许多新特性...",
          "highlight": "React <mark>18</mark>新特性详解",
          "author": {
            "username": "john_doe"
          },
          "board": {
            "name": "学习分享",
            "slug": "learning"
          }
        }
      ]
    },
    "users": {
      "total": 5,
      "results": [
        {
          "id": "user123",
          "username": "react_developer",
          "avatar": "/uploads/avatars/user123.jpg",
          "bio": "React爱好者"
        }
      ]
    },
    "boards": {
      "total": 1,
      "results": [
        {
          "id": "board123",
          "name": "学习分享",
          "slug": "learning",
          "icon": "📚"
        }
      ]
    }
  },
  "meta": {
    "query": "React",
    "totalResults": 31,
    "searchTime": 45
  }
}
```

---

## 12. WebSocket事件（实时通信）

### 12.1 连接

**URL:** `ws://localhost:3000`

**认证:** 连接时在URL中传递token
```
ws://localhost:3000?token=eyJhbGciOiJIUzI1NiIs...
```

### 12.2 事件类型

#### 12.2.1 服务器→客户端

**新通知:**
```json
{
  "event": "notification.new",
  "data": {
    "id": "notif123",
    "type": "COMMENT",
    "title": "新评论",
    "content": "john_doe 评论了你的帖子",
    "createdAt": "2026-01-23T19:00:00.000Z"
  }
}
```

**新评论:**
```json
{
  "event": "comment.new",
  "data": {
    "postId": "post123",
    "comment": {
      "id": "comment456",
      "content": "非常好的分享！",
      "author": {
        "username": "john_doe"
      },
      "createdAt": "2026-01-23T19:00:00.000Z"
    }
  }
}
```

**点赞数更新:**
```json
{
  "event": "like.update",
  "data": {
    "resourceType": "post",
    "resourceId": "post123",
    "likeCount": 90
  }
}
```

#### 12.2.2 客户端→服务器

**加入帖子房间:**
```json
{
  "event": "room.join",
  "data": {
    "room": "post:post123"
  }
}
```

**离开帖子房间:**
```json
{
  "event": "room.leave",
  "data": {
    "room": "post:post123"
  }
}
```

**正在输入:**
```json
{
  "event": "typing.start",
  "data": {
    "postId": "post123"
  }
}
```

**停止输入:**
```json
{
  "event": "typing.stop",
  "data": {
    "postId": "post123"
  }
}
```

---

## 13. 限流规则

### 13.1 速率限制

| 接口类型 | 限制 | 时间窗口 |
|---------|------|----------|
| 登录/注册 | 5次 | 15分钟 |
| 创建帖子 | 5次 | 1小时 |
| 创建评论 | 20次 | 1小时 |
| 点赞 | 50次 | 1小时 |
| 搜索 | 30次 | 1分钟 |
| 其他API | 100次 | 1分钟 |

### 13.2 限流响应

**触发限流时 (429 Too Many Requests):**
```json
{
  "statusCode": 429,
  "message": "Too many requests",
  "error": "Too Many Requests",
  "retryAfter": 3600
}
```

**响应Header:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642944000
```

---

## 14. 版本管理

### 14.1 API版本

**当前版本:** v1.0

**版本策略:** URL路径版本控制
```
/api/v1/posts
/api/v2/posts  (未来版本)
```

### 14.2 版本变更日志

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-01-23 | 初始版本 |

---

## 15. 测试环境

### 15.1 测试账号

**管理员账号:**
```
邮箱: admin@framezero.com
密码: Admin123!
```

**普通用户账号:**
```
邮箱: user@framezero.com
密码: User123!
```

### 15.2 测试数据

**测试数据库会定期重置，请勿存储重要数据**

---

## 附录A: 数据模型

### User（用户）
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  password: string;  // bcrypt加密
  avatar?: string;
  bio?: string;
  role: 'FOUNDER' | 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'BANNED' | 'DELETED';
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post（帖子）
```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  boardId: string;
  authorId: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Comment（评论）
```typescript
interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### CheckIn（打卡）
```typescript
interface CheckIn {
  id: string;
  userId: string;
  content?: string;
  studyHours: number;
  learnings: string[];
  checkInDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 附录B: 错误处理示例

### JavaScript/TypeScript

```typescript
try {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, content, boardId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const data = await response.json();
  console.log(data.data);
} catch (error) {
  console.error('API Error:', error.message);
}
```

---

## 附录C: Postman集合

可以导入以下Postman集合进行API测试：

```json
{
  "info": {
    "name": "Frame Zero API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ]
}
```

---

## 版本历史

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|----------|--------|
| v1.0 | 2026-01-23 | 初始版本，完成API接口定义 | - |
