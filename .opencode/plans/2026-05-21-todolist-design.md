# TodoList 应用设计方案

## 概述

一个功能完整的 TodoList 应用，支持用户注册登录、待办事项的增删改查、拖拽排序、分类/标签、优先级、截止日期和搜索筛选。

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 19 + TypeScript + Vite |
| 后端 | Python 3.14 + FastAPI |
| 数据库 | PostgreSQL 16（Docker，已运行） |
| ORM | SQLAlchemy（异步模式）+ Alembic |
| 拖拽 | @dnd-kit/core + @dnd-kit/sortable |
| 认证 | Session + Cookie（starlette SessionMiddleware） |

## 项目结构

`
todolist/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── todos.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── todo.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   └── todo.py
│   │   ├── __init__.py
│   │   ├── db.py
│   │   └── main.py
│   ├── alembic/
│   ├── alembic.ini
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.ts
│   │   │   └── todoApi.ts
│   │   ├── components/
│   │   │   ├── AddTodo.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   ├── PriorityBadge.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TodoEditModal.tsx
│   │   │   ├── TodoInput.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   └── TodoList.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── store/
│   │   │   └── useStore.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
├── .env
└── README.md
`

## 数据库设计

### users 表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 用户 ID |
| username | VARCHAR(50) | UNIQUE NOT NULL | 用户名 |
| hashed_password | VARCHAR(255) | NOT NULL | 密码哈希 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

### todos 表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | SERIAL | PRIMARY KEY | 待办 ID |
| user_id | INTEGER | FK → users.id, NOT NULL | 所属用户 |
| title | VARCHAR(255) | NOT NULL | 标题 |
| description | TEXT | | 描述 |
| completed | BOOLEAN | DEFAULT FALSE | 是否完成 |
| priority | INTEGER | DEFAULT 0 | 优先级 |
| category | VARCHAR(50) | DEFAULT '' | 分类 |
| due_date | DATE | | 截止日期 |
| sort_order | INTEGER | DEFAULT 0 | 排序序号 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

索引：(user_id, sort_order)、(user_id, category)

## API 设计

### 认证

| 方法 | 路径 | 请求体 | 响应 | 说明 |
|------|------|--------|------|------|
| POST | /api/auth/register | { username, password } | { id, username } | 注册 |
| POST | /api/auth/login | { username, password } | { id, username } | 登录，设置 Session Cookie |
| POST | /api/auth/logout | | { message } | 登出 |
| GET | /api/auth/me | | { id, username } | 获取当前用户 |

### 待办（需登录）

| 方法 | 路径 | 参数/请求体 | 响应 | 说明 |
|------|------|-------------|------|------|
| GET | /api/todos | ?category=&priority=&search= | Todo[] | 获取待办，支持筛选 |
| POST | /api/todos | { title, description?, priority?, category?, due_date? } | Todo | 创建 |
| PUT | /api/todos/{id} | { title?, description?, completed?, priority?, category?, due_date? } | Todo | 更新 |
| DELETE | /api/todos/{id} | | { message } | 删除 |
| PUT | /api/todos/reorder | { items: [{ id, sort_order }] } | { message } | 批量排序 |

## 前端页面与组件

### 路由

| 路由 | 页面 | 说明 |
|------|------|------|
| /login | LoginPage | 登录 |
| /register | RegisterPage | 注册 |
| / | HomePage | 主页面 |

### 状态管理

使用 Zustand，存放当前用户、待办列表、筛选条件、加载状态。

## 环境配置

`
DATABASE_URL=postgresql+asyncpg://postgres:root@localhost:5432/todolist
SESSION_SECRET=<随机字符串>
`

## UI 设计

三个页面已使用 Pencil 设计工具绘制并存于 untitled.pen：登录页、注册页、主页（导航栏 + 侧边栏 + 待办列表）。
