# Future Integrations & Known Limitations — Task Manager

---

## Перед деплоем в production

### SEC-001: Error handler раскрывает err.message в 500-ответах
**Статус:** Known limitation MVP  
**Зафиксировано:** 2026-05-29 (Security, Этап 2)  
**Описание:** `errorHandler.ts` возвращает `err.message` в ответе при 500. Внутренние сообщения SQLite могут содержать имена таблиц/колонок.  
**Действие:** Перед деплоем на production — различать dev/prod режимы: в prod возвращать только `"Internal server error"`, детали логировать на сервере.

### QA-001: GET /api/tasks не валидирует query params
**Статус:** Known limitation MVP  
**Зафиксировано:** 2026-05-29 (QA, Этап 2)  
**Описание:** Параметры `status` и `priority` в GET-запросе не проверяются через Zod. Невалидные значения (e.g. `?status=unknown`) возвращают пустой список без ошибки.  
**Действие:** Добавить Zod-валидацию query params в GET-обработчик (Этап 4 или отдельная задача).

---

## Риски деплоя (из Этапа 1)

### РИСК-001: SQLite ephemeral на Render
**Статус:** ✅ Accepted — MVP portfolio demo (Этап 5, 2026-05-29)
**Зафиксировано:** Этап 1  
**Описание:** Данные теряются при рестарте сервера на Render (ephemeral filesystem).  
**Решение:** Seed-скрипт избыточен для MVP. README содержит явное предупреждение: "SQLite data resets on each redeploy. Acceptable for portfolio demo."

### РИСК-002: Render cold starts
**Статус:** ✅ Accepted — задокументировано в README (Этап 5, 2026-05-29)
**Зафиксировано:** Этап 1  
**Описание:** Free tier Render имеет cold start ~30-60 сек.  
**Решение:** README содержит предупреждение: "First request after sleep may take 30–60 seconds."

---

## Этап 3 — Frontend: Known limitations

### FE-001: Нет frontend тестов
**Статус:** Out of scope MVP  
**Зафиксировано:** 2026-05-29 (Developer, Этап 3)  
**Описание:** `client/` не имеет настроенного `@testing-library/react` и Vitest-конфига для компонентов.  
**Действие:** Добавить тестирование компонентов в Этапе 4 или после деплоя как отдельная задача.

### FE-002: Refetch после каждой мутации (loading flash)
**Статус:** Known limitation MVP  
**Зафиксировано:** 2026-05-29 (Developer, Этап 3)  
**Описание:** После create/update/delete выполняется полный refetch — видна короткая вспышка loading state.  
**Действие:** Оптимистичные обновления (optimistic updates) — улучшение для Этапа 4.

### FE-003: Невозможно очистить description при редактировании задачи
**Статус:** ✅ Resolved — Этап 4 (2026-05-29)  
**Зафиксировано:** 2026-05-29 (QA, Этап 3)  
**Описание:** При редактировании задачи с description: если пользователь очищает поле и нажимает Save, description НЕ сбрасывается на сервере.  
**Решение:** TaskForm теперь отправляет `description: null` при пустом поле в режиме editing; `UpdateTaskDto.description` — `string | null`; updateTaskSchema уже имел `nullable()` — серверных изменений не потребовалось.
