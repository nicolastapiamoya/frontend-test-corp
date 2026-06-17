# frontend-test-corp — POC Angular

Frontend mínimo para la POC Banca Empresas. Standalone Angular 17 con 3 páginas y consumo de las APIs de transfers + loans.

## Run standalone (con el monorepo)

Desde la raíz del monorepo:

```bash
make up
```

URL: `http://localhost:4200`

## Run standalone (sin monorepo)

```bash
cd front
npm install
npm start
```

URL: `http://localhost:4200` (requiere las 2 APIs corriendo en :8081 y :8082).

## Páginas

- `/dashboard` — Health check visual de las 2 APIs (cards con status + memoria + uptime).
- `/transfers` — Listado + form para crear transferencias.
- `/loans` — Listado + form para crear loans.

## Headers Manhattan v4

El `ApiService` (src/app/services/api.service.ts) inyecta automáticamente en cada request:

```
X-Channel: web
X-Commerce: bfcl
X-Country: CL
X-Trace-Id: <uuid generado por request>
Content-Type: application/json
```

## Build para producción

```bash
npm run build
# Output: dist/frontend-test-corp/browser/
# Servido por nginx en Docker
```

## Próximos pasos (no en POC)

- Lazy load de rutas (ya hay lazy load, pero faltan guards).
- HTTP interceptor centralizado (en lugar de base class).
- Auth: OAuth 2.0 redirect flow.
- i18n (es-CL / en-US).
- Tests E2E con Playwright.