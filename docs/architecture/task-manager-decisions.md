# ADR: task-manager — Архитектурные решения

## ADR-001 — Без root package.json

**Решение:** Корневой `package.json` не создаётся.

**Почему:** Vercel деплоит только `client/`, Render только `server/` — каждый сервис настраивается на свой root directory. Workspace-монорепо добавляет сложность (hoisting, разрешение зависимостей) без пользы на уровне portfolio MVP. Два терминала (`cd client && npm run dev`, `cd server && npm run dev`) достаточно для локальной разработки.

**Отклонено:** npm workspaces — избыточно для двух независимо деплоящихся сервисов.

---

## ADR-002 — tsx для hot-reload вместо ts-node-dev

**Решение:** `tsx watch src/server.ts` — dev-сервер сервера.

**Почему:** tsx построен на esbuild (в 10-20× быстрее ts-node), активно поддерживается, корректно работает с ES modules и последними версиями Node.js. ts-node-dev устарел, имеет известные проблемы с ESM и TypeScript 5+.

**Отклонено:** ts-node-dev — медленнее, риск конфликтов с ESM в Node.js 20+.

---

## ADR-003 — CORS inline в app.ts

**Решение:** CORS-настройка остаётся в `server/src/app.ts`, отдельный файл не нужен.

**Почему:** Один известный origin (Vercel URL из `process.env.CLIENT_URL`), конфигурация не меняется во время выполнения. Отдельный файл оправдан при динамическом списке origins или сложной логике preflight.

---

## ADR-004 — Раздельные tsconfig в client/ и server/

**Решение:** Каждый сабпроект имеет свой `tsconfig.json`, общего в корне нет.

**Почему:** Таргеты принципиально разные:
- `client/`: `"lib": ["DOM", "ES2020"]`, jsx: react-jsx, target: браузер
- `server/`: `"types": ["node"]`, target: Node.js 20, outDir: dist/

Shared tsconfig потребовал бы composite-режима и Project References — избыточно.

---

## ADR-005 — Render: компилированный JS, не ts-node в продакшне

**Решение:**
- Build command (Render): `npm install && npm run build` → `tsc` компилирует в `dist/`
- Start command (Render): `node dist/server.js`
- Entry point: `server/src/server.ts` → `server/dist/server.js`

**tsconfig server обязательные поля:**
```json
{
  "outDir": "./dist",
  "rootDir": "./src",
  "target": "ES2020",
  "module": "CommonJS"
}
```

**Почему:** ts-node/tsx в продакшне — лишний overhead и зависимость; скомпилированный JS — стандарт.

---

## ADR-006 — Добавить server/.env.example

**Решение:** `server/.env.example` обязателен с переменными:
```
PORT=3001
CLIENT_URL=http://localhost:5173
```

**Почему:** Правило 8 CLAUDE.md — любая новая env-переменная сразу в .env.example.

---

## ⚠️ Зафиксированные риски

### РИСК-001 — SQLite ephemeral на Render free tier
**Severity:** Medium  
**Описание:** Render free tier использует ephemeral filesystem — все данные в SQLite (.db файл) теряются при каждом рестарте или редеплое сервиса.  
**Mitigation для portfolio:** Добавить seed-скрипт с демо-данными, который запускается при старте. Пометить в README как known limitation.  
**Future:** при необходимости persistence — мигрировать на Railway + PostgreSQL.

### РИСК-002 — Cold starts Render free tier
**Severity:** Low  
**Описание:** Render free tier засыпает после ~15 минут простоя. Первый запрос после cold start занимает 30-60 секунд.  
**Mitigation для portfolio:** Добавить notice в README/UI. Приемлемо для демо-проекта.
