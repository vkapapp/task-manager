# Plan: Full-Stack Task Manager

Портфолио проект для Upwork. Показывает: React + TypeScript, Node.js + Express, REST API, SQLite, тесты, чистый код.

**Live:** задеплоить на Vercel (client) + Render (server)
**GitHub:** github.com/vkapapp/task-manager

---

## Стек

| Часть    | Технология                              |
|----------|-----------------------------------------|
| Frontend | React 19 + Vite + TypeScript + Tailwind |
| Backend  | Node.js + Express + TypeScript          |
| База     | SQLite (better-sqlite3)                 |
| Тесты    | Vitest (server utils)                   |
| Линтер   | ESLint + Prettier                       |
| Деплой   | Vercel (client) + Render (server)       |

## Структура

```
task-manager/
  client/                  ← React фронтенд
    src/
      components/
        TaskList.tsx
        TaskCard.tsx
        TaskForm.tsx
        FilterBar.tsx
      hooks/
        useTasks.ts
      api/
        tasks.ts           ← HTTP клиент
      types/
        index.ts
      App.tsx
      main.tsx
    index.html
    vite.config.ts
    tsconfig.json
    eslint.config.js
    .prettierrc
    package.json

  server/                  ← Express API
    src/
      routes/
        tasks.ts
      db/
        index.ts           ← SQLite подключение
        migrations.ts      ← создание таблиц
      middleware/
        errorHandler.ts
        validate.ts
      types/
        index.ts
      app.ts
      server.ts
    tests/
      tasks.test.ts
    tsconfig.json
    eslint.config.js
    .prettierrc
    package.json

  .gitignore
  README.md
```

---

## Этапы

### Этап 1 — Scaffolding (~30 мин)
- [x] Инициализация git репозитория — выполнено в начале Этапа 2
- [x] Создание `client/` с Vite + React + TypeScript
- [x] Создание `server/` с TypeScript + **tsx** (не ts-node-dev — ADR-002)
- [x] ESLint + Prettier в обоих проектах
- [x] `.gitignore` (node_modules, dist, .env, *.db)
- [x] Базовый `README.md`
- [x] `server/.env.example` (PORT, CLIENT_URL — ADR-006)
- [x] `docs/architecture/task-manager-decisions.md` — создан

⚠️ **РИСК-001:** SQLite ephemeral на Render — данные теряются при рестарте. Seed-скрипт перенесён в Этап 5 (Деплой). Задокументировано в `docs/future-integrations.md`.
⚠️ **РИСК-002:** Render cold starts ~30-60 сек — пометить в README.

### Этап 2 — Backend: база и API (~45 мин)
- [x] SQLite подключение (`better-sqlite3`)
- [x] Миграция: таблица `tasks` (id, title, description, status, priority, created_at, updated_at)
- [x] REST API:
  - `GET    /api/tasks`          — список (фильтр по status/priority)
  - `POST   /api/tasks`          — создать
  - `PATCH  /api/tasks/:id`      — обновить
  - `DELETE /api/tasks/:id`      — удалить
- [x] Валидация входных данных (Zod — обязательно на всех endpoints с мутацией)
- [x] Error handler middleware
- [x] CORS для фронтенда
- [x] Тесты на валидацию (Vitest) — 10 pass, 0 fail
- [x] ⚠️ QA-флаг из Этапа 1: добавить обработчик `error` события на server instance в `server.ts` (graceful сообщение при EADDRINUSE вместо краша)
- [x] ⚠️ Security-флаг: добавить `helmet` middleware для security headers (X-Content-Type-Options, X-Frame-Options и др.)
- [x] ⚠️ Security-флаг: добавить `express-rate-limit` на /api/ (windowMs 15 мин, max 100)

### Этап 3 — Frontend: UI (~60 мин)
- [x] ⚠️ QA-флаг из Этапа 1: удалить неиспользуемые файлы Vite scaffold — `client/src/assets/hero.png`, `react.svg`, `vite.svg`
- [x] Tailwind CSS подключение
- [x] Типы: `Task`, `TaskStatus`, `TaskPriority`
- [x] API клиент (`fetch` wrapper)
- [x] `useTasks` хук (загрузка, создание, обновление, удаление)
- [x] Компоненты:
  - `TaskList` — список задач
  - `TaskCard` — карточка с действиями
  - `TaskForm` — форма создания/редактирования
  - `FilterBar` — фильтр по статусу и приоритету
- [x] Loading и Error состояния
- [x] Адаптивная вёрстка (mobile-friendly)

### Этап 4 — Полировка (~30 мин)
- [x] ⚠️ QA-флаг из Этапа 3: FE-003 — исправить невозможность очистки description при редактировании (client: отправлять `null` при пустом поле; server уже имел nullable())
- [x] ⚠️ QA-флаг из Этапа 3: удалить пустую папку `client/src/assets/`
- [x] Анимации (animate-fade-in для overlay, animate-slide-up для dialog и toast)
- [x] Empty state (нет задач) — реализован в Этапе 3
- [x] Тосты для уведомлений (create/update/delete) — useToast + ToastContainer
- [x] Проверка: ESLint чистый, нет console.log, нет any без комментария
- [x] `npm run build` — оба проекта без ошибок

### Этап 5 — Деплой (~20 мин)
- [ ] GitHub: создать репозиторий `task-manager`
- [ ] Vercel: задеплоить `client/`
- [ ] Render: задеплоить `server/` (free tier)
- [ ] Добавить в портфолио на Upwork

---

## Типы (contracts)

```typescript
type TaskStatus = 'todo' | 'in_progress' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'

interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  created_at: string
  updated_at: string
}

interface CreateTaskDto {
  title: string
  description?: string
  priority?: TaskPriority
}

interface UpdateTaskDto {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
}
```

---

## Правила кода

- TypeScript strict mode — нет `any` без комментария
- Нет `console.log` в продакшн-коде
- Все `.env` переменные в `.env.example`
- ESLint + Prettier — 0 ошибок перед каждым этапом
- Коммиты по этапам: `feat: add backend api`, `feat: add react ui`, etc.
