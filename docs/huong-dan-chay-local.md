# Hướng dẫn chạy BmadCRMMini tại local

Tài liệu này mô tả cách thiết lập và chạy dự án **BmadCRMMini** trên máy phát triển. Dự án là CRM cá nhân cho solo tool provider, xây dựng bằng Next.js (App Router), shadcn/ui, Prisma và PostgreSQL.

---

## Yêu cầu hệ thống

| Thành phần | Phiên bản / ghi chú |
|------------|---------------------|
| **Node.js** | 20 trở lên |
| **npm** | Đi kèm Node.js |
| **Docker Desktop** | Dùng để chạy PostgreSQL qua Docker Compose |
| **Git** | Clone repository |

Kiểm tra nhanh:

```bash
node -v
npm -v
docker --version
docker compose version
```

---

## Tổng quan các bước

1. Clone repository và cài dependencies
2. Khởi động PostgreSQL (Docker)
3. Tạo file `.env` từ mẫu
4. Chạy migration và seed dữ liệu ban đầu
5. Chạy dev server và đăng nhập

---

## 1. Clone và cài dependencies

```bash
git clone <url-repository> BmadCRMMini
cd BmadCRMMini
npm install
```

Lệnh `npm install` sẽ tự chạy `prisma generate` (hook `postinstall`) để tạo Prisma Client tại `src/generated/prisma/`.

Nếu cần generate lại thủ công:

```bash
npx prisma generate
```

---

## 2. Khởi động PostgreSQL

Dự án dùng PostgreSQL 16 qua Docker Compose. File cấu hình: `docker-compose.yml`.

```bash
docker compose up -d
```

Thông số mặc định:

| Biến | Giá trị |
|------|---------|
| Host | `localhost` |
| Port | `5432` |
| User | `postgres` |
| Password | `postgres` |
| Database | `bmadcrmmini` |

Kiểm tra container đang chạy:

```bash
docker compose ps
```

Dừng database (khi không dùng):

```bash
docker compose down
```

> **Lưu ý:** Dữ liệu được lưu trong Docker volume `bmadcrmmini_pgdata`, nên `docker compose down` không xóa dữ liệu. Để xóa sạch volume: `docker compose down -v`.

---

## 3. Cấu hình biến môi trường

Sao chép file mẫu:

**Windows (PowerShell / CMD):**

```powershell
copy .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Mở `.env` và cập nhật các biến sau:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bmadcrmmini?schema=public"
AUTH_SECRET="<chuỗi-bí-mật-ngẫu-nhiên>"
OPERATOR_EMAIL="operator@example.com"
OPERATOR_PASSWORD="change-me-local-only"
OPERATOR_NAME="Operator"
```

### Giải thích từng biến

| Biến | Mô tả |
|------|--------|
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL. Phải khớp với `docker-compose.yml` nếu dùng Docker mặc định. |
| `AUTH_SECRET` | Secret ký JWT cho Auth.js. **Bắt buộc** khi chạy ứng dụng. |
| `OPERATOR_EMAIL` | Email tài khoản operator — dùng để seed và đăng nhập. |
| `OPERATOR_PASSWORD` | Mật khẩu plaintext chỉ dùng lúc seed; trong DB lưu dạng bcrypt hash. |
| `OPERATOR_NAME` | Tên hiển thị (tùy chọn). |

### Tạo `AUTH_SECRET`

**macOS / Linux (OpenSSL):**

```bash
openssl rand -base64 32
```

**Windows (PowerShell):**

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

**Hoặc dùng Node.js (mọi hệ điều hành):**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Dán kết quả vào `AUTH_SECRET` trong file `.env`.

---

## 4. Migration và seed

Áp dụng schema database:

```bash
npx prisma migrate dev
```

Lệnh trên sẽ:

- Tạo/cập nhật bảng theo `prisma/schema.prisma`
- Chạy các file migration trong `prisma/migrations/`

Seed dữ liệu ban đầu (operator + cài đặt mặc định):

```bash
npx prisma db seed
```

Seed sẽ:

- Tạo hoặc cập nhật user operator từ `OPERATOR_EMAIL` / `OPERATOR_PASSWORD`
- Ghi các `AppSetting` mặc định (`staleStatusDays`, `followUpDays`, `renewalWindowDays`)

### Công cụ Prisma hữu ích

```bash
npx prisma studio          # Giao diện web xem/sửa dữ liệu (http://localhost:5555)
npx prisma migrate status  # Kiểm tra trạng thái migration
```

---

## 5. Chạy ứng dụng

### Chế độ phát triển

```bash
npm run dev
```

Mở trình duyệt: [http://localhost:3000](http://localhost:3000)

- Chưa đăng nhập → tự redirect về `/login`
- Đăng nhập bằng `OPERATOR_EMAIL` và `OPERATOR_PASSWORD` đã cấu hình trong `.env`

### Chế độ production (local)

```bash
npm run build
npm run start
```

Ứng dụng vẫn chạy tại [http://localhost:3000](http://localhost:3000) (mặc định của Next.js).

---

## 6. Scripts npm thường dùng

| Lệnh | Mục đích |
|------|----------|
| `npm run dev` | Dev server với hot reload |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build production |
| `npm run lint` | Kiểm tra ESLint |
| `npm run typecheck` | Kiểm tra TypeScript (`tsc --noEmit`) |
| `npm run format` | Format code với Prettier |
| `npm run test:e2e` | Chạy test E2E (Playwright) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run test:e2e:install` | Cài/tải lại browser Chromium cho Playwright |
| `npm run test:e2e:report` | Mở báo cáo HTML sau khi chạy test |

---

## 7. Chạy test E2E (Playwright)

**Điều kiện tiên quyết:** Docker PostgreSQL đang chạy, đã `migrate` + `seed`, file `.env` hợp lệ.

Cài browser Chromium (lần đầu hoặc khi bị lỗi):

```bash
npm run test:e2e:install
```

Chạy toàn bộ test:

```bash
npm run test:e2e
```

Playwright tự khởi động dev server (`npm run dev`) nếu chưa có server tại `http://localhost:3000`. Có thể đổi URL qua biến `PLAYWRIGHT_BASE_URL`.

Chạy với giao diện tương tác:

```bash
npm run test:e2e:ui
```

### Sửa lỗi Playwright UI trên Windows

Nếu gặp lỗi kiểu `file data stream has unexpected number of bytes` hoặc `zip file is truncated`:

```powershell
Remove-Item -Recurse -Force test-results, playwright-report -ErrorAction SilentlyContinue
npm run test:e2e:install
npm run test:e2e:ui
```

---

## 8. Cấu trúc thư mục chính

```
BmadCRMMini/
├── docs/                    # Tài liệu dự án
├── prisma/
│   ├── schema.prisma        # Định nghĩa model database
│   ├── migrations/          # Migration SQL
│   └── seed.ts              # Seed operator + settings
├── src/
│   ├── app/
│   │   ├── (app)/           # Routes CRM (có sidebar, cần đăng nhập)
│   │   └── login/           # Trang đăng nhập
│   ├── auth.ts              # Cấu hình Auth.js
│   ├── middleware.ts        # Bảo vệ routes
│   ├── components/          # UI components (shadcn, dashboard, ...)
│   ├── lib/                 # DB, validations, helpers
│   └── generated/prisma/    # Prisma Client (tự sinh)
├── tests/e2e/               # Test Playwright theo epic
├── docker-compose.yml       # PostgreSQL local
├── .env.example             # Mẫu biến môi trường
└── playwright.config.ts     # Cấu hình E2E
```

---

## 9. Xử lý sự cố thường gặp

### Port 5432 đã được sử dụng

PostgreSQL khác đang chiếm port 5432. Có thể:

- Dừng service PostgreSQL local, hoặc
- Sửa port trong `docker-compose.yml` (ví dụ `5433:5432`) và cập nhật `DATABASE_URL` tương ứng

### Lỗi kết nối database khi `npm run dev`

1. Kiểm tra Docker: `docker compose ps`
2. Kiểm tra `DATABASE_URL` trong `.env`
3. Chạy lại: `npx prisma migrate dev`

### Lỗi `OPERATOR_EMAIL and OPERATOR_PASSWORD are required for seed`

Đảm bảo `.env` có đủ `OPERATOR_EMAIL` và `OPERATOR_PASSWORD` trước khi chạy `npx prisma db seed`.

### Không đăng nhập được

1. Chạy lại seed: `npx prisma db seed`
2. Xác nhận email/password khớp `.env` (email được normalize — chữ thường, trim khoảng trắng)
3. Kiểm tra `AUTH_SECRET` đã được set (không còn giá trị placeholder)

### Lỗi Prisma Client chưa generate

```bash
npx prisma generate
```

### Reset database hoàn toàn

```bash
docker compose down -v
docker compose up -d
npx prisma migrate dev
npx prisma db seed
```

---

## 10. Checklist thiết lập lần đầu

- [ ] Node.js 20+ và Docker Desktop đã cài
- [ ] `npm install` thành công
- [ ] `docker compose up -d` — PostgreSQL healthy
- [ ] File `.env` đã tạo và `AUTH_SECRET` đã thay bằng giá trị thật
- [ ] `npx prisma migrate dev` — không lỗi
- [ ] `npx prisma db seed` — operator đã tạo
- [ ] `npm run dev` — mở http://localhost:3000 và đăng nhập thành công

---

## Tham khảo thêm

- [README.md](../README.md) — tóm tắt nhanh trong repo
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)
