# So Sánh Kiến Trúc Database - PostgreSQL + Prisma vs Raw PostgreSQL

Ngày tạo: 20/06/2026

## 1. SO SÁNH 3 CÁCH TIẾP CẬN

### **Cách 1: PostgreSQL + Raw SQL (KHÔNG dùng ORM)**

```typescript
// ❌ Cách cũ - Raw SQL
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function getUser(email: string) {
  const result = await pool.query(
    'SELECT id, email, name FROM "User" WHERE email = $1',
    [email]
  );
  return result.rows[0]; // ❌ Type là 'any', không type-safe
}

// ❌ Dễ SQL injection nếu không cẩn thận
const dangerousQuery = `SELECT * FROM "User" WHERE name = '${userName}'`; // NGUY HIỂM!
```

**ƯU ĐIỂM**:
- ✅ Kiểm soát 100% SQL query
- ✅ Performance tối ưu cho query phức tạp
- ✅ Không phụ thuộc ORM library

**NHƯỢC ĐIỂM**:
- ❌ Không type-safe (TypeScript không biết structure của data)
- ❌ Phải tự viết SQL thủ công cho mọi query
- ❌ Khó maintain khi schema thay đổi (phải sửa SQL khắp nơi)
- ❌ Dễ SQL injection nếu không parameterize
- ❌ Phải tự quản lý migration (ALTER TABLE, CREATE INDEX...)
- ❌ Relationship joins phức tạp (phải viết nhiều JOIN)

---

### **Cách 2: PostgreSQL + Prisma ORM (HIỆN TẠI - KHUYẾN NGHỊ)**

```typescript
// ✅ Cách hiện đại - Prisma ORM
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function getUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true }
  });
  return user; // ✅ Type đầy đủ: { id: string; email: string; name: string | null }
}

// ✅ Tự động prevent SQL injection
// ✅ Auto-complete trong VS Code
// ✅ Relations dễ dàng
const userWithAttempts = await prisma.user.findUnique({
  where: { email: 'test@example.com' },
  include: {
    exerciseAttempts: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
});
```

**ƯU ĐIỂM**:
- ✅ **Type-safe 100%**: TypeScript biết chính xác structure của mọi bảng
- ✅ **Auto-complete**: VS Code gợi ý tất cả fields, relations
- ✅ **Migration tự động**: `prisma migrate dev` tự tạo SQL migration
- ✅ **Prevent SQL injection**: Prisma tự động sanitize input
- ✅ **Relations dễ**: `include`, `select` thay vì viết JOIN
- ✅ **Schema single source of truth**: `schema.prisma` là nguồn duy nhất
- ✅ **Prisma Studio**: GUI quản lý data (giống phpMyAdmin)
- ✅ **Developer Experience tốt**: Code nhanh hơn 3-5 lần so với raw SQL
- ✅ **Transaction API dễ dùng**: `prisma.$transaction([...])`

**NHƯỢC ĐIỂM**:
- ⚠️ Learning curve nhỏ (phải học Prisma syntax)
- ⚠️ Performance hơi chậm hơn raw SQL ~5-10% (do overhead ORM)
- ⚠️ Query phức tạp đặc biệt có thể cần fallback sang raw SQL
- ⚠️ Bundle size tăng (~500KB cho Prisma Client)

---

### **Cách 3: Chỉ PostgreSQL (KHÔNG KHUYẾN NGHỊ cho Next.js/TypeScript)**

**KHÔNG tồn tại khái niệm "chỉ Prisma"** vì Prisma vẫn cần database backend.

Nếu bạn muốn hỏi **"Chỉ dùng PostgreSQL, bỏ Prisma"**:
- ❌ Mất tất cả ưu điểm type-safe
- ❌ Phải tự viết migration scripts
- ❌ Code dài gấp 3-5 lần
- ❌ Khó maintain khi team lớn

---

## 2. DỰ ÁN HIỆN TẠI ĐANG DÙNG: **PostgreSQL + Prisma ORM**

### **Kiến trúc thực tế**:

```
Next.js App (Frontend/Backend)
    ↓
Prisma Client (@prisma/client 6.19.3)
    ↓
PostgreSQL Database (english_app)
    - 26 bảng (User, Exercise, Question, Badge, Leaderboard...)
    - Lưu trữ data thực tế
    - ACID transactions
```

### **Schema Prisma hiện tại** (`prisma/schema.prisma`):

```prisma
// Định nghĩa database
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Generator tạo TypeScript types
generator client {
  provider = "prisma-client-js"
}

// 26 models (bảng)
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  xp            Int      @default(0)
  level         Int      @default(1)
  streakCount   Int      @default(0)
  // ... 26 models khác
}
```

### **Ví dụ thực tế trong code**:

#### **Submit bài tập** (`api/exercises/submit/route.ts`):

```typescript
// ✅ Prisma transaction type-safe
const result = await prisma.$transaction(async (tx) => {
  // 1. Tạo attempt
  const attempt = await tx.exerciseAttempt.create({
    data: {
      userId: session.user.id,
      exerciseId,
      score,
      xpEarned,
      // ...
    }
  });

  // 2. Update user XP
  const updatedUser = await tx.user.update({
    where: { id: session.user.id },
    data: {
      xp: { increment: xpEarned },
      level: newLevel
    }
  });

  // 3. Update leaderboard
  await tx.leaderboard.upsert({
    where: {
      userId_period_periodType: {
        userId: session.user.id,
        period: currentWeek,
        periodType: 'tuan'
      }
    },
    update: { score: { increment: rankingScore } },
    create: { /* ... */ }
  });

  return { attempt, updatedUser };
});
```

**Nếu dùng raw SQL, code trên sẽ dài ~200 dòng và dễ lỗi.**

---

## 3. TẠI SAO CHỌN PostgreSQL + Prisma ORM?

### **3.1. Type Safety (Quan trọng nhất)**

```typescript
// ❌ Raw SQL - không biết structure
const user = await pool.query('SELECT * FROM "User" WHERE id = $1', [userId]);
console.log(user.rows[0].email); // ❌ VS Code không gợi ý, dễ typo

// ✅ Prisma - type đầy đủ
const user = await prisma.user.findUnique({ where: { id: userId } });
console.log(user?.email); // ✅ VS Code gợi ý 'email', 'name', 'xp', ...
```

### **3.2. Migration tự động**

```bash
# ❌ Raw SQL - phải tự viết migration
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  xp INTEGER DEFAULT 0
);

# ✅ Prisma - chỉ cần sửa schema.prisma, auto generate migration
npx prisma migrate dev --name add_xp_field
```

### **3.3. Relations dễ dàng**

```typescript
// ❌ Raw SQL - phải viết JOIN thủ công
const result = await pool.query(`
  SELECT u.*, COUNT(ea.id) as attempt_count
  FROM "User" u
  LEFT JOIN "ExerciseAttempt" ea ON ea."userId" = u.id
  WHERE u.id = $1
  GROUP BY u.id
`, [userId]);

// ✅ Prisma - 3 dòng
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: { exerciseAttempts: true }
});
```

### **3.4. Developer Experience**

| Tác vụ | Raw SQL | Prisma ORM |
|--------|---------|------------|
| Tạo query đơn giản | ~10 dòng | ~3 dòng |
| Thay đổi schema | Sửa SQL + tìm tất cả queries cũ | Sửa `schema.prisma` → auto migrate |
| Type checking | ❌ Không có | ✅ Compile-time error |
| Auto-complete | ❌ Không | ✅ 100% fields |
| Prevent SQL injection | ⚠️ Phải tự parameterize | ✅ Tự động |
| GUI quản lý data | Cần cài pgAdmin | ✅ `npx prisma studio` |

---

## 4. KHI NÀO CẦN RAW SQL?

Prisma **KHÔNG PHẢI** thay thế 100% raw SQL. Vẫn có lúc cần raw:

### **4.1. Query phức tạp với window functions**

```typescript
// Prisma không hỗ trợ WINDOW functions trực tiếp
const result = await prisma.$queryRaw`
  SELECT
    user_id,
    score,
    RANK() OVER (PARTITION BY period ORDER BY score DESC) as rank
  FROM "Leaderboard"
  WHERE period_type = 'thang'
`;
```

### **4.2. Full-text search**

```typescript
// PostgreSQL full-text search
const results = await prisma.$queryRaw`
  SELECT * FROM "Exercise"
  WHERE to_tsvector('english', title) @@ to_tsquery('pronunciation')
`;
```

### **4.3. Bulk operations lớn**

```typescript
// Insert 10,000 records - raw SQL nhanh hơn
await prisma.$executeRaw`
  INSERT INTO "QuestionBankItem" (id, content, ipa, ...)
  SELECT * FROM unnest($1::text[], $2::text[], ...)
`;
```

**DỰ ÁN HIỆN TẠI**: 95% queries dùng Prisma, 5% dùng raw SQL khi cần optimize.

---

## 5. SO SÁNH VỚI CÁC ORM KHÁC

| ORM | Language | Ưu điểm | Nhược điểm |
|-----|----------|---------|------------|
| **Prisma** | TypeScript | ✅ Type-safe tốt nhất<br>✅ DX tuyệt vời<br>✅ Migration auto | ⚠️ Bundle size lớn |
| Drizzle | TypeScript | ✅ Bundle nhỏ<br>✅ SQL-like syntax | ⚠️ Learning curve cao |
| TypeORM | TypeScript | ✅ Mature, nhiều features | ❌ Type inference yếu |
| Sequelize | JavaScript | ✅ Phổ biến | ❌ Không type-safe |
| Knex.js | JavaScript | ✅ Query builder linh hoạt | ❌ Không type-safe |

**CHỌN PRISMA VÌ**: Type-safe + DX tốt + phù hợp Next.js App Router.

---

## 6. KIẾN TRÚC DATABASE HIỆN TẠI (26 BẢNG)

### **Core Tables (User & Auth)**:
- `User` (id, email, name, xp, level, streakCount, gems, ...)
- `Session`, `VerificationToken`, `Authenticator` (NextAuth)

### **Content Tables (IPA/Lessons)**:
- `Topic` (4 chủ đề: CD1 Nguyên âm, CD2 Phụ âm, CD3 Minimal Pairs, CD4 Trọng âm)
- `Level` (Beginner, Intermediate, Advanced)
- `LearningMap` (25 maps)
- `Exercise` (112 bài tập)
- `Question` (278 câu hỏi)
- `QuestionType` (6 loại: listen_choose, speak_word, ...)
- `AnswerOption` (options cho từng câu)

### **Question Bank (Kho IPA/Audio)**:
- `Phoneme` (44 âm IPA)
- `SoundGroup` (30 nhóm âm)
- `WordItem` (196 từ)
- `MinimalPair` (69 cặp từ)
- `SentenceItem` (~60 câu)
- `QuestionBankItem` (433 items)

### **Gamification Tables**:
- `ExerciseAttempt` (lịch sử làm bài)
- `QuestionAttempt` (chi tiết từng câu)
- `Badge` (11 huy hiệu)
- `UserBadge` (huy hiệu đã đạt)
- `Leaderboard` (bảng xếp hạng tuần/tháng)
- `DailyActivity` (hoạt động hàng ngày)
- `DailyQuest` (nhiệm vụ hàng ngày - SP7)

**TẤT CẢ 26 BẢNG NÀY** được quản lý bởi Prisma, lưu trữ thực tế trên PostgreSQL.

---

## 7. KẾT LUẬN

### **❓ "Database nếu chuyển hoàn toàn Prisma ORM thì sao?"**

**KHÔNG THỂ** "chuyển hoàn toàn Prisma ORM" vì:
- ✅ Prisma là **ORM tool**, KHÔNG phải database
- ✅ Prisma **vẫn cần PostgreSQL** bên dưới để lưu data
- ✅ Prisma chỉ là **layer trung gian** giữa app và database

### **❓ "PostgreSQL + Prisma ORM thì sao sẽ có gì xảy ra?"**

**ĐÂY LÀ KIẾN TRÚC ĐANG DÙNG** - kết quả:

| Tiêu chí | Trước (Raw SQL) | Sau (PostgreSQL + Prisma) |
|----------|----------------|---------------------------|
| **Type Safety** | ❌ Không có | ✅ 100% type-safe |
| **Code length** | 100 dòng | 30 dòng (giảm 70%) |
| **Development speed** | Chậm | Nhanh hơn 3-5 lần |
| **Bug density** | Cao (typo, SQL injection) | Thấp (compile-time check) |
| **Maintenance** | Khó (schema change = sửa khắp nơi) | Dễ (chỉ sửa schema.prisma) |
| **Migration** | Thủ công (dễ lỗi) | Tự động (safe) |
| **Performance** | 100% | ~95% (overhead nhỏ) |

### **KHUYẾN NGHỊ CHO KHÓA LUẬN**:

✅ **GIỮ NGUYÊN** kiến trúc hiện tại: **PostgreSQL + Prisma ORM**

**LÝ DO**:
1. ✅ Type-safe → ít bug → phát triển nhanh
2. ✅ Migration tự động → dễ maintain schema (26 bảng)
3. ✅ DX tốt → code nhanh hơn (còn 8 ngày deadline)
4. ✅ Phù hợp Next.js + TypeScript ecosystem
5. ✅ Prisma Studio GUI → dễ debug data

**KHI NÀO CẦN RAW SQL**:
- ⚠️ Query phức tạp (window functions, full-text search)
- ⚠️ Bulk operations lớn (>1000 records)
- ⚠️ Performance critical queries

**TRONG BÁO CÁO KHÓA LUẬN**:
- Giải thích: "Prisma ORM được sử dụng để tăng type-safety và tăng tốc phát triển, đồng thời vẫn giữ PostgreSQL làm database chính"
- Không viết "thay PostgreSQL bằng Prisma" (SAI!)
- Viết "PostgreSQL với Prisma ORM" hoặc "PostgreSQL được truy cập qua Prisma ORM"

---

## 8. TÀI LIỆU THAM KHẢO

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js + Prisma Best Practices](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

---

**File này giúp**: Hiểu rõ vai trò Prisma ORM vs PostgreSQL, tránh nhầm lẫn khi viết báo cáo khóa luận.
