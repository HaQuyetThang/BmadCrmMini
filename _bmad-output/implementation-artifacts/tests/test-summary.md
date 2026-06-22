# Test Automation Summary

Generated: 2026-06-21

## Framework

- **Playwright** (`@playwright/test`) — scaffold mới cho project
- Config: `playwright.config.ts`
- Test data prefix: `E2E ` (auto cleanup sau mỗi spec file)

## Generated Tests

### E2E Tests — Epic 1

| File | Story | Tests |
|------|-------|-------|
| `tests/e2e/epic-1/app-shell.spec.ts` | 1.1 | Sidebar nav, navigate surfaces |
| `tests/e2e/epic-1/auth.spec.ts` | 1.2 | Redirect, login, invalid creds, logout |
| `tests/e2e/epic-1/quick-capture.spec.ts` | 1.3 | FAB save lead, Ctrl+K shortcut |
| `tests/e2e/epic-1/customers.spec.ts` | 1.4 | Search, profile edit, soft delete |
| `tests/e2e/epic-1/pipeline.spec.ts` | 1.5 | Pipeline list, filter, status change |
| `tests/e2e/epic-1/renewal-stale.spec.ts` | 1.6, 1.7 | Stale badge, renewal approaching/overdue |
| `tests/e2e/epic-1/timeline.spec.ts` | 1.8 | Empty state, add entry, login support |

### Helpers

- `tests/helpers/auth.ts` — login/logout, toast assertion, unique names
- `tests/helpers/db.ts` — Prisma seed/cleanup for test customers

## Coverage

| Epic 1 area | Automated | Notes |
|-------------|-----------|-------|
| App shell / sidebar | ✅ | |
| Auth (login/logout/guard) | ✅ | |
| Quick capture lead | ✅ | Ctrl+K requires page focus |
| Customer list & profile | ✅ | |
| Pipeline status & list | ✅ | |
| Stale detection | ✅ | DB seed `statusChangedAt` |
| Renewal badges | ✅ | DB seed `renewalDate` |
| Timeline read/write | ✅ | |
| Promote toast (1.3) | ⬜ | Optional UX flow — deferred |
| Stale banner dismiss (1.6) | ⬜ | localStorage — deferred |
| Package price preview (1.7) | ⬜ | Static preview — deferred |

**Epic 1 UI flows: 8/8 stories covered (16 tests)**

## Prerequisites

```powershell
docker compose up -d
npx prisma migrate dev
npx prisma db seed
```

Credentials: `OPERATOR_EMAIL` / `OPERATOR_PASSWORD` trong `.env`.

## Run

```powershell
npm run test:e2e          # headless, auto-starts dev server
npm run test:e2e:ui       # Playwright UI mode
npm run test:e2e:report   # HTML report sau khi chạy
```

## Bug fixed during test setup

- `pipeline-list-row.tsx` — thêm `"use client"` vì truyền `onClick` xuống `StatusSelect` (trang `/pipeline` crash trước đó)

## Next Steps

- Thêm CI job chạy `npm run test:e2e` (cần PostgreSQL service)
- Bổ sung test promote toast, stale banner dismiss khi cần regression coverage
- Cân nhắc `globalSetup` chạy migrate trước suite
