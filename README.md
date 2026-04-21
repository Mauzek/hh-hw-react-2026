## Что сделано:

**React**

- Настройки: логин, репозиторий, blacklist с сохранением в `localStorage`
- Запрос к GitHub REST API с кешированием через `axios-cache-interceptor`
- Фильтрация текущего пользователя и blacklist
- Случайный выбор ревьюера с анимацией рулетки

**Redux**

- Хранение ответов GitHub API в store
- `idle / loading / success / error` статусы

**Дополнительно**

- SSR — начальные данные загружаются на сервере
- Проксирование запросов через Route Handler (обход CORS)

## Стек

Next.js 16 · React 19 · TypeScript · Redux Toolkit · SCSS Modules · Framer Motion + настроена инфраструктура

### **[🚀 Демо](https://reviewerfinder.vercel.app/)**

DEFAULT_REPO = `facebook/facebook-ios-sdk`
