# 📝 Frame Zero 数据库设置指南

## 🚀 方式一：自动创建数据库（推荐）

### 1. 运行数据库初始化脚本

```bash
./setup-mysql.sh
```

脚本会提示你输入 MySQL root 密码，然后自动创建数据库和用户。

---

## 🔧 方式二：手动创建数据库

### 如果你的 MySQL root 用户没有密码：

```bash
mysql -u root
```

### 如果需要密码：

```bash
mysql -u root -p
```

### 然后执行以下 SQL 命令：

```sql
-- 创建数据库
CREATE DATABASE frame_zero CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'framezero'@'localhost' IDENTIFIED BY 'framezero';

-- 授权
GRANT ALL PRIVILEGES ON frame_zero.* TO 'framezero'@'localhost;

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

---

## 🔍 方式三：使用 MySQL Workbench（图形界面）

### 步骤：

1. **打开 MySQL Workbench**

2. **创建数据库**
   - 点击左侧 `Schemas` 栏
   - 右键点击 → `Create Schema`
   - Name: `frame_zero`
   - Collation: 选择 `utf8mb4_unicode_ci`
   - 点击 `Apply`

3. **创建用户**
   - 点击 `Management` → `Users and Privileges`
   - 点击 `Add account`
   - Username: `framezero`
   - Password: `framezero`
   - 勾选 `Create schema` → 选择 `frame_zero`
   - 点击 `Apply`

---

## ⚠️ 常见问题

### Q1: 提示 "Access denied for user 'root'@'localhost"

**解决方案:**

```bash
# 尝试不带密码连接
mysql -u root

# 如果上面成功，说明root没有密码
# 如果需要设置密码：
mysql -u root
```

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
FLUSH PRIVILEGES;
EXIT;
```

### Q2: 提示 "Can't connect to MySQL server"

**解决方案:**

```bash
# macOS: 启动 MySQL
sudo /usr/local/mysql/support-files/mysql.server start

# 或使用 Anaconda MySQL
conda install mysql
```

### Q3: 忘记 root 密码

**解决方案:**

```bash
# macOS (Homebrew 安装的 MySQL)
# 停止 MySQL
sudo brew services stop mysql

# 以安全模式启动
sudo mysqld_safe --skip-grant-tables &

# 登录并重置密码
mysql -u root
```

```sql
USE mysql;
UPDATE user SET authentication_string=PASSWORD('') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# 重启 MySQL
sudo brew services restart mysql
```

---

## 📊 验证数据库创建成功

### 测试连接

```bash
mysql -u framezero -pframezero frame_zero
```

如果成功登录，执行：

```sql
SHOW TABLES;
EXIT;
```

---

## 🎯 数据库创建成功后

运行快速启动脚本：

```bash
./start-dev.sh
```

这会自动配置后端和前端，然后提示你在新终端窗口启动服务。

---

**创建数据库遇到问题？**

请告诉我具体的错误信息，我会帮你解决！
