# CineScope — Angular TMDb Movies

Адаптивное SPA для просмотра популярных фильмов, поиска по названию и просмотра подробностей через официальный TMDb API. Реализовано по спецификации из корня проекта. Интерфейс — на английском языке, тёмная тема с адаптивной сеткой карточек.

## Технологии

- Angular **22.2.1**, standalone components, Signals, OnPush, zoneless change detection.
- Angular Router с ленивой загрузкой всех страниц; Angular HttpClient.
- TypeScript **6.0** со строгой типизацией и `strictTemplates`.
- Tailwind CSS **4**, официальный PostCSS-плагин.
- RxJS для отменяемых HTTP-потоков, ESLint 10, angular-eslint 22, Prettier.
- Стандартный Angular CLI application builder: esbuild для production и Vite для dev server. Отдельной конфигурации Vite нет.

Версии Angular и совместимость Node/TypeScript проверены по [реестру npm](https://www.npmjs.com/package/@angular/core) и [официальной таблице Angular](https://angular.dev/reference/versions). Точные установленные версии зависимостей зафиксированы в `package-lock.json`.

## Установка

Нужен Node.js **24.15+** в ветке 24 (проверено на 24.21.0) либо совместимая версия из таблицы Angular. Используется npm.

```sh
npm ci
```

## Настройка TMDb

1. Создайте аккаунт на [TMDb](https://www.themoviedb.org/).
2. В [настройках API](https://www.themoviedb.org/settings/api) запросите доступ к API.
3. Скопируйте **API Read Access Token**, который используется в заголовке `Authorization: Bearer …`. Это не короткий API key и не пользовательский токен авторизации.
4. Создайте локальный файл токена:

```powershell
Copy-Item src/environments/tmdb-token.ts src/environments/tmdb-token.local.ts
```

В `tmdb-token.local.ts` задайте свой Read Access Token в строке `tmdbApiToken`. Этот файл исключён из Git, ESLint и Prettier, чтобы диагностика не выводила токен. Не записывайте настоящий токен в отслеживаемый `tmdb-token.ts`: его пустое значение служит безопасной конфигурацией по умолчанию.

`src/environments/environment.ts` — единственный источник URL API и изображений и типизированной конфигурации `TmdbConfig`. Он импортирует токен из `tmdb-token.ts`. Конфигурация Angular `local` подменяет только этот модуль файлом `tmdb-token.local.ts` через стандартный `fileReplacements`; URL не дублируются. В `app.config.ts` конфигурация зарегистрирована через provider `TMDB_CONFIG`. Сервис API и компонент постера продолжают использовать `inject(TMDB_CONFIG)`.

Генерация файлов и runtime-загрузка отсутствуют: Angular builder собирает обычные TypeScript-модули. `.env` больше не читается приложением. Имеющийся локальный `.env` сохранён; при миграции непустой токен перенесён в локальный файл без вывода его значения. После смены токена перезапустите dev server или пересоберите production.

**Frontend-токен доступен пользователям:** исключение локального файла из Git защищает репозиторий, но токен остаётся видимым в JavaScript bundle и сетевых запросах. Environment-файлы не обеспечивают секретность. Подробнее: [аутентификация TMDb](https://developer.themoviedb.org/docs/authentication-application).

## Запуск

```sh
npm start -- --configuration local
```

Приложение доступно на `http://127.0.0.1:4200/`.

## Сборка и качество кода

```sh
npm run lint
npm run format:check
npm run build
```

Для production с локальным токеном выполните `npm run build -- --configuration production,local`. Обычные `npm start` и `npm run build` используют пустой токен: приложение показывает сообщение о настройке и не отправляет неавторизованные запросы. В чистом checkout сначала создайте локальный файл по инструкции выше; CI должен предоставить этот игнорируемый файл перед сборкой с `local`, без генератора в проекте. См. [Angular fileReplacements](https://angular.dev/tools/cli/environments).

`npm run format` форматирует код. Production-файлы находятся в `dist/movies/browser`. Для размещения нужен обычный статический хостинг: неизвестные пути должны отдавать `index.html`, чтобы прямое открытие `/movie/123` и обновление страницы работали. Серверный API приложения не требуется.

В ограниченной Windows-среде, где esbuild не может читать родительские папки рабочего каталога, проверка сборки выполнена через временный `subst` рабочего каталога. Обычному локальному окружению это не требуется.

## Функциональность

- Автоматическая загрузка популярных фильмов; пагинация, ограниченная максимумом TMDb в 500 страниц.
- Поиск с debounce 400 мс, немедленная отправка кнопкой Search или Enter, очистка с возвратом популярных фильмов.
- Отмена предыдущего запроса сразу при изменении ввода, включая период debounce. Старый ответ не может заменить новый.
- Карточки с постерами, рейтингом, годом и ограниченным overview; семантические ссылки и lazy loading изображений.
- Заглушка для отсутствующего постера и для ошибки загрузки изображения.
- Подробности: описание, жанры, рейтинг, дата выхода, длительность и язык.
- Независимые loading/error состояния списка и деталей, skeleton UI, empty state и Retry.
- Возврат через историю приложения с fallback на каталог при прямом открытии страницы фильма.
- Поисковый запрос, результаты и страница списка сохраняются в сервисе при переходе к фильму и обратно, без повторного HTTP-запроса. После полной перезагрузки страницы состояние сбрасывается.
- Маршруты `/`, `/movie/:id`, `**` с отдельной 404-страницей.
- Адаптивные 2–5 колонок, keyboard navigation, видимый фокус, skip link, подпись поиска, alt и reduced-motion.

## Архитектура

```text
src/
  app/
    core/
      api/                     # Типизированный транспорт TMDb
      config/                  # Конфигурация и injection token
      models/                  # Movie, MovieDetails, Genre, MoviesResponse
    features/movies/
      components/              # MovieCard, MovieSearch, MovieList
      pages/                   # Каталог и подробности
      services/                # MovieService: состояние и действия
    shared/
      components/              # Иконки, постер, status panel
      pages/                   # Not Found
    app.component.ts
    app.config.ts
    app.routes.ts
  main.ts
  styles.css
  environments/                # Environment и модуль токена
public/favicon.svg
```

`TmdbApiService` отвечает только за HTTP: три endpoint, Bearer header, query parameters и таймаут 15 секунд. `MovieService` владеет состоянием feature. HTTP-потоки переключаются через `switchMap`, преобразуются в readonly signals через `toSignal`; производные значения вычисляются через `computed`. Writable signal запроса скрыт внутри сервиса. Ошибки переводятся в понятные сообщения без вывода технического ответа API.

Компоненты отображают состояние и отправляют действия. Страница деталей подписывается на параметры Router с `takeUntilDestroyed`; при уходе отменяет запрос деталей. Состояние списка и детали независимы. Используются `@if`, `@else`, `@for` с `track movie.id` и `inject()`. NgModules, NgRx, `any`, backend и авторизация пользователей отсутствуют.

## Проверка реализации

- `npm run lint` — успешно.
- `npm run format:check` — успешно.
- `npm run build` — успешно, production AOT и строгая проверка шаблонов.
- После упрощения конфигурации проверены TypeScript, ESLint, Prettier, обычная production-сборка и сборка `production,local`. Dev server с конфигурацией `local` компилируется и отдаёт страницу с HTTP 200. Регистрация `TMDB_CONFIG` в `app.config.ts`, получение конфигурации сервисом через DI и формирование запроса с непустым Bearer header проверены без добавления тестов или файлов проверки.
- Сетевой запрос к TMDb из текущей среды завершить не удалось. Поэтому фактическая валидность локального токена, авторизованный ответ API и загрузка изображения требуют проверки в браузере с доступом к TMDb. Формирование URL постера сохранено без изменений.
- В браузере на production-сборке с временными контролируемыми API-ответами проверены популярные фильмы, поиск, debounce, отмена устаревшего HTTP-запроса, сохранение поиска при возврате, детали, пагинация, loading/error/empty, Retry, отсутствие/ошибка постера, прямые маршруты и адаптивность.
- Реальные авторизованные запросы TMDb требуют вашего токена и не проверялись без него. Тестовые данные и временный сервер проверки не входят в приложение.
- Постоянные unit/e2e tests не добавлены согласно спецификации.

Данные и изображения предоставляются TMDb. This product uses the TMDB API but is not endorsed or certified by TMDB.
