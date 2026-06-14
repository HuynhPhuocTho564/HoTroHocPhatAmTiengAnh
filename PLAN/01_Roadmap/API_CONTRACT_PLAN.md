# API Contract Plan

Ngay lap: 14/06/2026

Pham vi:

- `POST /api/exercises/submit`
- `GET /api/checkin`
- `POST /api/checkin`
- `GET /api/leaderboard`
- `GET /api/badges`
- `POST /api/badges/check`
- `GET /api/admin/exercises`
- `POST /api/admin/exercises`
- `GET /api/admin/exercises/[id]`
- `PATCH /api/admin/exercises/[id]`
- `DELETE /api/admin/exercises/[id]`
- `GET /api/admin/exercises/[id]/questions`
- `POST /api/admin/exercises/[id]/questions`
- `GET /api/admin/questions/[questionId]`
- `PATCH /api/admin/questions/[questionId]`
- `DELETE /api/admin/questions/[questionId]`
- `GET /api/admin/topics`
- `POST /api/admin/topics`
- `PATCH /api/admin/topics/[id]`
- `DELETE /api/admin/topics/[id]`
- `GET /api/admin/levels`
- `POST /api/admin/levels`
- `PATCH /api/admin/levels/[id]`
- `DELETE /api/admin/levels/[id]`
- `GET /api/admin/maps`
- `POST /api/admin/maps`
- `PATCH /api/admin/maps/[id]`
- `DELETE /api/admin/maps/[id]`

Nguyen tac:

- API tra JSON nhat quan.
- Cac API lien quan user lay user tu session; khong tin `userId` trong payload cho luong nhay cam.
- Khong tin diem tu client. Client gui cau tra loi/transcript; server tinh diem.
- Ranking/XP/badge/update daily activity nen nam o server.
- Loi tra ve co `error.code`, `error.message`.
- Khi code API, xem mapping skill tai `PLAN/05_AI_Skills/SKILL_USAGE_BY_PHASE.md`.
- Rieng submit/scoring can doc `nextjs_app_router_expert`, `question-bank-curator`, `gamification_designer` va `project-quality-gate`.
- Rieng admin API phai check session role `Admin`, validate payload tai server va xoa mem bang status khi can giu lich su attempt.

## 1. Response format chung

Thanh cong:

```json
{
  "success": true,
  "data": {}
}
```

That bai:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payload khong hop le"
  }
}
```

HTTP status goi y:

- `200`: thanh cong.
- `201`: tao moi thanh cong.
- `400`: payload sai.
- `401`: chua dang nhap.
- `403`: khong co quyen.
- `404`: khong tim thay.
- `409`: da thuc hien roi, vi du check-in hom nay.
- `500`: loi server.

## 2. POST /api/exercises/submit

Muc tieu:

- Nop ket qua bai lam.
- Server tinh diem tung cau, diem bai, XP, Ranking Score.
- Cap nhat `ExerciseAttempt`, `QuestionAttempt`, `User.xp`, `DailyActivity`, `Leaderboard`.
- Kiem tra badge neu can.

Trang thai 14/06/2026:

- Da implement endpoint MVP tai `english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts`.
- Da co scoring server-side va transaction update attempt/user/daily activity/leaderboard.
- `badgesAwarded` hien tra `[]`; logic cap badge chi tiet se lam trong Phase 3.
- Endpoint uu tien session tu `auth()`, nhung van chap nhan `userId` payload tam thoi theo Phase 2.

Request:

```json
{
  "userId": "user-id-temp-until-session-ready",
  "exerciseId": "ex-1-listen",
  "startedAt": "2026-06-14T10:00:00.000Z",
  "completedAt": "2026-06-14T10:05:00.000Z",
  "answers": [
    {
      "questionId": "q-1",
      "selectedOptionId": "opt-1",
      "selectedText": "/ɪ/",
      "transcript": null,
      "audioUrl": null,
      "timeSpent": 8
    },
    {
      "questionId": "q-2",
      "selectedOptionId": null,
      "selectedText": null,
      "transcript": "ship",
      "audioUrl": null,
      "timeSpent": 12
    }
  ]
}
```

Ghi chu:

- `selectedOptionId` dung cho `listen_choose`.
- `transcript` dung cho `speak_word`, `speak_minimal_pair`, `speak_sentence`.
- `audioUrl` de sau neu co luu recording cua user.
- Server query `Question`, `QuestionType`, `AnswerOption` de cham diem.
- Client khong gui `isCorrect`, `score`, `xp`, `rankingScore`.

Response:

```json
{
  "success": true,
  "data": {
    "exerciseAttemptId": "attempt-id",
    "exerciseScore": 85,
    "maxScore": 100,
    "isCompleted": true,
    "rating": "GOOD",
    "summary": {
      "totalQuestions": 5,
      "correctAnswers": 4,
      "timeSpent": 180
    },
    "rewards": {
      "xpEarned": 68,
      "dailyBonusXp": 10,
      "retakeXp": 0,
      "totalXpEarned": 78,
      "rankingDelta": 85,
      "dailyBonusRanking": 4,
      "retakeRanking": 0,
      "totalRankingDelta": 89
    },
    "progress": {
      "currentXp": 420,
      "level": 3,
      "nextLevelXp": 500
    },
    "dailyActivity": {
      "date": "2026-06-14",
      "completedExercises": 3,
      "xpEarned": 120
    },
    "badgesAwarded": [
      {
        "id": "badge-id",
        "name": "Phat am xuat sac",
        "type": "RARE"
      }
    ],
    "questionResults": [
      {
        "questionId": "q-1",
        "isCorrect": true,
        "score": 10,
        "accuracyScore": null,
        "feedback": "Dung"
      },
      {
        "questionId": "q-2",
        "isCorrect": true,
        "score": 16,
        "accuracyScore": 80,
        "feedback": "Phat am gan dung"
      }
    ]
  }
}
```

Quy tac diem:

- `exerciseScore >= 70`: hoan thanh.
- `exerciseScore >= 80`: tot.
- `exerciseScore >= 90`: xuat sac, co the cap badge.
- Ranking Score lan dau: cong theo diem bai.
- Lam lai diem cao hon best: cong phan cai thien.
- Lam lai diem bang/thap hon best: cong it XP va it Ranking Score on tap, co tran/ngay.
- Daily bonus: cong ca XP va Ranking Score, co tran/ngay.

DB side effects:

- Tao `ExerciseAttempt`.
- Tao nhieu `QuestionAttempt`.
- Update `User.xp`, `User.level`.
- Upsert `DailyActivity`.
- Upsert `Leaderboard` cho `tuan` va `thang`.
- Cap `UserBadge` neu du dieu kien.

Loi:

```json
{
  "success": false,
  "error": {
    "code": "QUESTION_NOT_IN_EXERCISE",
    "message": "Mot cau hoi khong thuoc bai tap nay"
  }
}
```

Error code goi y:

- `UNAUTHENTICATED`
- `VALIDATION_ERROR`
- `EXERCISE_NOT_FOUND`
- `QUESTION_NOT_FOUND`
- `QUESTION_NOT_IN_EXERCISE`
- `EMPTY_ANSWERS`
- `INTERNAL_ERROR`

## 3. GET /api/checkin

Muc tieu:

- Lay trang thai diem danh/streak cua user.

Trang thai 14/06/2026:

- Da implement theo response format chung.
- Uu tien session tu `auth()`, van chap nhan `userId` query tam thoi den Phase 4.

Query:

```text
/api/checkin?userId=user-id
```

Sau khi session hoan thien, co the bo `userId` va lay tu session.

Response:

```json
{
  "success": true,
  "data": {
    "currentStreak": 5,
    "longestStreak": 10,
    "totalCheckIns": 12,
    "lastCheckInDate": "2026-06-13T10:00:00.000Z",
    "canCheckIn": true,
    "todayReward": {
      "xp": 10,
      "rankingScore": 2
    }
  }
}
```

## 4. POST /api/checkin

Muc tieu:

- Diem danh moi ngay.
- Cong `+10 XP`, `+2 Ranking Score`.
- Cap nhat streak.
- Cap badge streak neu dat moc.

Trang thai 14/06/2026:

- Da implement transaction update `User`, `DailyActivity`, `Leaderboard`.
- Da cap badge streak MVP qua `checkAndAwardBadges`.

Request:

```json
{
  "userId": "user-id-temp-until-session-ready"
}
```

Response thanh cong:

```json
{
  "success": true,
  "data": {
    "message": "Check-in successful",
    "currentStreak": 6,
    "longestStreak": 10,
    "totalCheckIns": 13,
    "reward": {
      "xp": 10,
      "rankingScore": 2
    },
    "badgesAwarded": [
      {
        "id": "badge-id",
        "name": "Mot tuan ben bi",
        "type": "COMMON"
      }
    ],
    "canCheckIn": false
  }
}
```

Response neu da diem danh:

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_CHECKED_IN",
    "message": "Hom nay da diem danh"
  },
  "data": {
    "currentStreak": 6,
    "canCheckIn": false
  }
}
```

DB side effects:

- Update `User.lastCheckInDate`, `streakCount`, `longestStreak`, `totalCheckIns`, `xp`.
- Upsert `DailyActivity.checkIns`, `xpEarned`.
- Upsert `Leaderboard.score` cho tuan/thang.
- Cap `UserBadge` neu dat streak milestone.

## 5. GET /api/leaderboard

Muc tieu:

- Lay bang xep hang theo ky.

Trang thai 14/06/2026:

- Da implement `type=tuan|thang`, `period` optional, `limit` default/max.
- Response tra top users, diem hang, so cau dung, so bai va badge noi bat.

Query:

```text
/api/leaderboard?type=tuan&period=2026-W24&limit=10
/api/leaderboard?type=thang&period=2026-06&limit=10
```

Param:

- `type`: `tuan` | `thang`
- `period`: optional, neu khong co thi lay ky hien tai.
- `limit`: optional, default 10, max 50.

Response:

```json
{
  "success": true,
  "data": {
    "type": "tuan",
    "period": "2026-W24",
    "items": [
      {
        "rank": 1,
        "userId": "user-1",
        "username": "An",
        "avatarUrl": null,
        "level": 4,
        "score": 320,
        "correctAnswers": 28,
        "completedExercises": 8,
        "badges": [
          {
            "name": "Phat am xuat sac",
            "type": "RARE"
          }
        ]
      }
    ],
    "currentUser": {
      "rank": 12,
      "score": 120
    }
  }
}
```

Loi:

- `INVALID_LEADERBOARD_TYPE`
- `INVALID_PERIOD`

## 6. GET /api/badges

Muc tieu:

- Lay danh sach huy hieu va trang thai user da dat/chua dat.

Trang thai 14/06/2026:

- Da implement danh sach `earned`, `available`, `summary`.
- `available.progress` tinh tu attempt, streak va weekly leaderboard hien tai.

Query:

```text
/api/badges?userId=user-id
```

Response:

```json
{
  "success": true,
  "data": {
    "earned": [
      {
        "id": "badge-id",
        "name": "Tai nghe tinh",
        "description": "Dat >= 80 diem o 5 bai nghe",
        "type": "RARE",
        "image": null,
        "earnedAt": "2026-06-14T10:00:00.000Z",
        "validPeriod": null
      }
    ],
    "available": [
      {
        "id": "badge-id-2",
        "name": "Top 10 tuan",
        "description": "Nam trong top 10 weekly leaderboard",
        "type": "PERIODIC",
        "image": null,
        "condition": "Top 10 weekly leaderboard",
        "progress": {
          "current": 7,
          "target": 10,
          "unit": "rank"
        }
      }
    ]
  }
}
```

## 7. POST /api/badges/check

Muc tieu:

- Kiem tra va cap huy hieu cho user.
- API nay co the dung noi bo sau submit/check-in, hoac goi tu admin/debug.

Trang thai 14/06/2026:

- Da implement endpoint MVP.
- `POST /api/exercises/submit` va `POST /api/checkin` da goi helper badge trong transaction, nen endpoint nay chu yeu phuc vu debug/admin sau nay.

Request:

```json
{
  "userId": "user-id",
  "reason": "exercise_submit"
}
```

`reason` goi y:

- `exercise_submit`
- `daily_checkin`
- `leaderboard_update`
- `manual`

Response:

```json
{
  "success": true,
  "data": {
    "badgesAwarded": [
      {
        "id": "badge-id",
        "name": "Tien bo ro ret",
        "type": "RARE"
      }
    ]
  }
}
```

## 8. Admin exercise/question API

Muc tieu:

- Cho admin tao/sua/xoa mem bai tap, cau hoi va option o muc MVP.
- Phuc vu tab Admin CRUD sau nay, chua bat buoc co form UI ngay.
- Khong xoa vat ly bai tap/cau hoi da co attempt; dung `status = ARCHIVED`.

Trang thai 14/06/2026:

- Da implement helper `src/lib/admin-api.ts`.
- Da implement cac route:
  - `GET/POST /api/admin/exercises`
  - `GET/PATCH/DELETE /api/admin/exercises/[id]`
  - `GET/POST /api/admin/exercises/[id]/questions`
  - `GET/PATCH/DELETE /api/admin/questions/[questionId]`
- Da noi UI `ExerciseManagement.tsx` voi API bai tap: tao, sua metadata/trang thai va xoa mem bai tap.
- Da noi UI `ExerciseManagement.tsx` voi API cau hoi: tai danh sach cau hoi, tao/sua/xoa mem cau hoi va thay the options.
- Da implement va noi UI `TopicLevelMapManagement.tsx` voi API topic/level/learning map.
- Da cap nhat luong user-facing `/exercises`, `/exercises/[id]`, `/api/exercises/submit` de chi dung bai/cau hoi `ACTIVE`.

Bao mat:

- Moi route admin goi `auth()`.
- Neu chua dang nhap tra `401 UNAUTHENTICATED`.
- Neu role khong phai `Admin` tra `403 FORBIDDEN`.
- Client khong duoc gui role hay userId de qua mat quyen.

### 8.1 GET /api/admin/exercises

Response:

```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": "exercise-id",
        "name": "Bai 1: Luyen tai",
        "description": "Nghe va chon am dung",
        "status": "ACTIVE",
        "timeLimit": null,
        "questionCount": 5,
        "topic": { "id": "topic-id", "name": "Nguyen am don" },
        "level": { "id": "level-id", "name": "De" },
        "map": { "id": "map-id", "name": "Bai 1" },
        "totalQuestions": 5,
        "attemptCount": 12
      }
    ]
  }
}
```

### 8.2 POST /api/admin/exercises

Request:

```json
{
  "name": "Bai moi",
  "description": "Mo ta ngan",
  "topicId": "topic-id",
  "levelId": "level-id",
  "mapId": "map-id",
  "status": "DRAFT",
  "timeLimit": 600
}
```

Quy tac:

- `name`, `topicId`, `levelId`, `mapId` bat buoc.
- `status`: `ACTIVE`, `LOCKED`, `DRAFT`, `ARCHIVED`; mac dinh `DRAFT`.
- Tao bai moi voi `questionCount = 0`.

### 8.3 GET/PATCH/DELETE /api/admin/exercises/[id]

`GET` tra chi tiet bai tap kem danh sach cau hoi/options.

`PATCH` cho phep sua cac truong:

```json
{
  "name": "Ten moi",
  "description": "Mo ta moi",
  "topicId": "topic-id",
  "levelId": "level-id",
  "mapId": "map-id",
  "status": "ACTIVE",
  "timeLimit": 900
}
```

`DELETE` khong xoa record vat ly, chi update:

```json
{
  "status": "ARCHIVED"
}
```

### 8.4 GET/POST /api/admin/exercises/[id]/questions

`GET` tra danh sach cau hoi cua bai tap.

`POST` tao cau hoi moi:

```json
{
  "typeId": "qtype-1-mc",
  "name": "Tu nay chua am nao?",
  "contentJson": {
    "word": "ship",
    "ipa": "/ship/",
    "audioUrl": "/audio/ship.mp3"
  },
  "answer": "/i/",
  "score": 10,
  "status": "DRAFT",
  "options": [
    { "content": "/i/" },
    { "content": "/i:/" }
  ]
}
```

Quy tac:

- `typeId`, `content` hoac `contentJson`, `answer` bat buoc.
- `score` trong khoang 1-100, mac dinh 10.
- `status`: `ACTIVE`, `DRAFT`, `NEEDS_REVIEW`, `ARCHIVED`; mac dinh `DRAFT`.
- Neu co `options`, can 2-8 lua chon va phai co mot option trung `answer`.
- Sau khi tao/sua/xoa mem cau hoi, server cap nhat lai `Exercise.questionCount` theo so cau `ACTIVE`.

### 8.5 GET/PATCH/DELETE /api/admin/questions/[questionId]

`GET` tra chi tiet cau hoi.

`PATCH` cho phep sua:

```json
{
  "typeId": "qtype-2-voice",
  "name": "Doc tu nay thanh tieng",
  "content": "ship",
  "answer": "ship",
  "score": 10,
  "status": "ACTIVE",
  "options": null
}
```

Ghi chu:

- `options: null` nghia la xoa toan bo options cua cau hoi, dung cho bai voice.
- `options: [...]` se thay the danh sach options hien tai.
- `DELETE` chi doi `status = ARCHIVED`.

Loi goi y:

- `UNAUTHENTICATED`
- `FORBIDDEN`
- `VALIDATION_ERROR`
- `REFERENCE_NOT_FOUND`
- `EXERCISE_NOT_FOUND`
- `QUESTION_NOT_FOUND`
- `QUESTION_TYPE_NOT_FOUND`
- `INTERNAL_ERROR`

## 8.6 Admin topic/level/map API

Muc tieu:

- Quan ly du lieu nen de admin co the tao bai tap ma khong phai sua seed script.
- Topic/Level chua co `status` trong schema, nen `DELETE` chi xoa khi chua co `Exercise` hoac `SoundGroup` lien ket.
- LearningMap co `status`, nen `DELETE` la xoa mem bang `status = ARCHIVED`.

Routes:

- `GET/POST /api/admin/topics`
- `PATCH/DELETE /api/admin/topics/[id]`
- `GET/POST /api/admin/levels`
- `PATCH/DELETE /api/admin/levels/[id]`
- `GET/POST /api/admin/maps`
- `PATCH/DELETE /api/admin/maps/[id]`

Request tao/sua topic/level:

```json
{
  "name": "Nguyen am don",
  "description": "Nhom am can luyen"
}
```

Request tao/sua learning map:

```json
{
  "name": "Bai 1: /i:/ vs /i/",
  "requirement": "De",
  "status": "DRAFT"
}
```

Response item topic/level:

```json
{
  "id": "topic-id",
  "name": "Nguyen am don",
  "description": "Nhom am can luyen",
  "exerciseCount": 4,
  "soundGroupCount": 1
}
```

Response item learning map:

```json
{
  "id": "map-id",
  "name": "Bai 1: /i:/ vs /i/",
  "requirement": "De",
  "status": "ACTIVE",
  "exerciseCount": 4,
  "progressCount": 0
}
```

## 9. Bao mat va session

Trang thai hien tai:

- Auth da co NextAuth.
- Cac API user/gamification nhay cam da lay user tu session.
- Admin API da check role `Admin`.

Huong chot:

- Phase 2 da tung tam nhan `userId` de noi flow.
- Phase 4 da chuyen sang lay user tu `auth()`.
- Khi dung session that, khong cho client submit thay user khac.
- Admin API phai tiep tuc check role cho moi route ghi du lieu.

## 10. Period helper

Leaderboard can helper tao period:

```text
type=tuan -> YYYY-Www, vi du 2026-W24
type=thang -> YYYY-MM, vi du 2026-06
```

Nen dat trong:

```text
src/lib/period.ts
```

## 11. File can tao/sua khi code

Phase 2:

- Tao `src/app/api/exercises/submit/route.ts`
- Tao `src/lib/scoring.ts`
- Tao `src/lib/period.ts`
- Cap nhat `src/app/exercises/[id]/ExerciseEngineClient.tsx` de goi submit.

Phase 3:

- Tao/cap nhat `src/lib/gamification.ts`
- Tao `src/app/api/leaderboard/route.ts`
- Tao `src/app/api/badges/route.ts`
- Tao `src/app/api/badges/check/route.ts` neu can endpoint rieng.
- Cap nhat `src/app/api/checkin/route.ts` theo contract moi.
- Cap nhat pages: dashboard, badges, leaderboard, checkin.
