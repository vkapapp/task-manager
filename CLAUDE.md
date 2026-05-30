# CLAUDE.md — task-manager

Портфолио проект: full-stack task manager (React + Node.js + SQLite).

> Глобальные правила (коммиты, безопасность, стиль кода) — в `~/.claude/CLAUDE.md`
> Workspace-правила (команды, /team-work) — в `freelance/CLAUDE.md`

---

## Стек

| Слой | Инструмент |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS v4 |
| Backend | Node.js + Express + TypeScript |
| БД | SQLite (`better-sqlite3`) |
| Валидация | Zod |
| Тесты | Vitest (server) |
| Безопасность | Helmet + express-rate-limit |
| Деплой | Vercel |

## Структура

```
task-manager/
  client/
    src/
      App.tsx
      components/     ← UI компоненты
      hooks/          ← кастомные хуки
      api/            ← fetch-обёртки к серверу
      types/          ← TypeScript типы
  server/
    src/
      app.ts          ← Express app (без listen)
      server.ts       ← listen + graceful shutdown
      routes/         ← роутеры по доменам
      middleware/     ← auth, validation, error handler
      db/             ← SQLite подключение, миграции
      types/          ← TypeScript типы, DTO
```

## Команды

```bash
# Frontend (из client/)
npm run dev      # Vite dev-сервер
npm run build    # TypeScript + Vite сборка

# Backend (из server/)
npm run dev      # tsx watch (hot reload)
npm run build    # tsc → dist/
npm test         # Vitest
```

## Переменные окружения

```
# server/.env
PORT=3001
```

## Live

- Production: https://task-manager-nu-jade-33.vercel.app/

---

## Настройка команд /team-work (один раз)

Для работы команд цепочки из этой папки нужны симлинки:

```bash
mkdir -p .claude
ln -s ../../../.claude/commands .claude/commands
ln -s ../../_prompts _prompts
```

Симлинки в `.gitignore` — в git не попадают.
