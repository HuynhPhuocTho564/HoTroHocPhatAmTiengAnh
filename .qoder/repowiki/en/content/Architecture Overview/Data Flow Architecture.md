# Data Flow Architecture

<cite>
**Referenced Files in This Document**
- [main.py](file://english_pronunciation_app/backend/app/main.py)
- [config.py](file://english_pronunciation_app/backend/app/core/config.py)
- [database.py](file://english_pronunciation_app/backend/app/core/database.py)
- [prisma.ts](file://english_pronunciation_app/frontend/src/lib/prisma.ts)
- [scoring.ts](file://english_pronunciation_app/frontend/src/lib/scoring.ts)
- [gamification.ts](file://english_pronunciation_app/frontend/src/lib/gamification.ts)
- [page.tsx](file://english_pronunciation_app/frontend/src/app/exercises/[id]/page.tsx)
- [route.ts](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts)
- [useSpeechRecognition.ts](file://english_pronunciation_app/frontend/src/hooks/useSpeechRecognition.ts)
- [useWaveformRecorder.ts](file://english_pronunciation_app/frontend/src/hooks/useWaveformRecorder.ts)
- [RecordButton.tsx](file://english_pronunciation_app/frontend/src/components/audio/RecordButton.tsx)
- [layout.tsx](file://english_pronunciation_app/frontend/src/app/layout.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document describes the end-to-end data flow architecture for Web_HoTroPhatAmEN, focusing on how user input progresses through speech recording, AI-like assessment, scoring engine, gamification, and database persistence. It also covers exercise selection, content retrieval, interactive rendering, result processing, leaderboard updates, and real-time-like progression indicators. The goal is to provide a comprehensive, accessible guide for developers and stakeholders to understand how user data moves across the system.

## Project Structure
The system follows a modern full-stack architecture:
- Frontend (Next.js App Router) handles UI, user interactions, speech/audio capture, and API orchestration.
- Backend (FastAPI) exposes health and minimal endpoints; most business logic resides in the frontend via server actions and API routes.
- Database (via Prisma) stores exercises, user attempts, leaderboards, and user profiles.
- Real-time-like updates occur through periodic client-side polling and optimistic UI updates.

```mermaid
graph TB
subgraph "Frontend (Next.js)"
UI["User Interface<br/>Interactive Rendering"]
Hooks["Hooks & Audio Capture<br/>useSpeechRecognition, useWaveformRecorder"]
LibScoring["Scoring Engine<br/>scoring.ts"]
LibGamification["Gamification & XP<br/>gamification.ts"]
Prisma["Prisma Client<br/>prisma.ts"]
API["Server Actions & API Routes<br/>/api/exercises/submit"]
Page["Exercise Page Loader<br/>/exercises/[id]"]
end
subgraph "Backend (FastAPI)"
FastAPI["FastAPI App<br/>main.py"]
Config["Config & CORS<br/>config.py"]
DB["Database Layer<br/>database.py"]
end
subgraph "Database"
Postgres["PostgreSQL"]
end
UI --> Hooks
Hooks --> API
API --> LibScoring
API --> LibGamification
API --> Prisma
Prisma --> Postgres
Page --> Prisma
Page --> UI
FastAPI --> Config
FastAPI --> DB
DB --> Postgres
```

**Diagram sources**
- [main.py:10-42](file://english_pronunciation_app/backend/app/main.py#L10-L42)
- [config.py:9-33](file://english_pronunciation_app/backend/app/core/config.py#L9-L33)
- [database.py:10-50](file://english_pronunciation_app/backend/app/core/database.py#L10-L50)
- [prisma.ts:1-13](file://english_pronunciation_app/frontend/src/lib/prisma.ts#L1-L13)
- [scoring.ts:191-226](file://english_pronunciation_app/frontend/src/lib/scoring.ts#L191-L226)
- [gamification.ts:195-234](file://english_pronunciation_app/frontend/src/lib/gamification.ts#L195-L234)
- [route.ts:47-331](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L47-L331)
- [page.tsx:47-91](file://english_pronunciation_app/frontend/src/app/exercises/[id]/page.tsx#L47-L91)

**Section sources**
- [main.py:1-43](file://english_pronunciation_app/backend/app/main.py#L1-L43)
- [config.py:1-34](file://english_pronunciation_app/backend/app/core/config.py#L1-L34)
- [database.py:1-51](file://english_pronunciation_app/backend/app/core/database.py#L1-L51)
- [prisma.ts:1-13](file://english_pronunciation_app/frontend/src/lib/prisma.ts#L1-L13)
- [layout.tsx:1-51](file://english_pronunciation_app/frontend/src/app/layout.tsx#L1-L51)

## Core Components
- Exercise Content Loader: Fetches and normalizes exercise content and questions from the database for rendering.
- Speech/Audio Capture: Provides microphone recording and speech recognition state machine for voice tasks.
- Scoring Engine: Implements question-type-specific scoring, normalization, and accuracy computation.
- Gamification & XP System: Computes XP rewards, streaks, and leaderboard deltas; manages badges.
- Submission Pipeline: Validates input, computes scores, persists attempts, updates user and leaderboard data atomically.

**Section sources**
- [page.tsx:47-91](file://english_pronunciation_app/frontend/src/app/exercises/[id]/page.tsx#L47-L91)
- [useSpeechRecognition.ts:15-110](file://english_pronunciation_app/frontend/src/hooks/useSpeechRecognition.ts#L15-L110)
- [useWaveformRecorder.ts:29-139](file://english_pronunciation_app/frontend/src/hooks/useWaveformRecorder.ts#L29-L139)
- [scoring.ts:191-226](file://english_pronunciation_app/frontend/src/lib/scoring.ts#L191-L226)
- [gamification.ts:195-234](file://english_pronunciation_app/frontend/src/lib/gamification.ts#L195-L234)
- [route.ts:47-331](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L47-L331)

## Architecture Overview
The system separates concerns across layers:
- Presentation: Next.js pages and components render exercises and collect user input.
- Interaction: Hooks manage speech and waveform recording; components trigger submission.
- Processing: API route orchestrates scoring, gamification, and database transactions.
- Persistence: Prisma connects to PostgreSQL for all data operations.

```mermaid
sequenceDiagram
participant U as "User"
participant P as "Exercise Page<br/>page.tsx"
participant C as "Audio/Speech Hooks<br/>useWaveformRecorder.ts / useSpeechRecognition.ts"
participant A as "Submission API<br/>/api/exercises/submit/route.ts"
participant S as "Scoring Engine<br/>scoring.ts"
participant G as "Gamification<br/>gamification.ts"
participant DB as "Prisma/DB"
U->>P : Open exercise
P->>DB : Load exercise + questions
DB-->>P : Exercise data
P-->>U : Render interactive UI
U->>C : Start recording/listening
C-->>U : Provide transcript/audioUrl
U->>A : Submit answers
A->>DB : Validate exercise + user
A->>S : Score each question
S-->>A : Question results
A->>G : Compute XP/rewards/leaderboard deltas
G-->>A : Rewards + badges
A->>DB : Atomic transaction (attempt + user + daily + leaderboard + badges)
DB-->>A : Persisted results
A-->>U : Summary + progress + badges
```

**Diagram sources**
- [page.tsx:47-91](file://english_pronunciation_app/frontend/src/app/exercises/[id]/page.tsx#L47-L91)
- [useWaveformRecorder.ts:99-139](file://english_pronunciation_app/frontend/src/hooks/useWaveformRecorder.ts#L99-L139)
- [useSpeechRecognition.ts:50-84](file://english_pronunciation_app/frontend/src/hooks/useSpeechRecognition.ts#L50-L84)
- [route.ts:47-331](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L47-L331)
- [scoring.ts:191-226](file://english_pronunciation_app/frontend/src/lib/scoring.ts#L191-L226)
- [gamification.ts:195-234](file://english_pronunciation_app/frontend/src/lib/gamification.ts#L195-L234)

## Detailed Component Analysis

### Exercise Selection and Content Retrieval
- The exercise loader fetches an ACTIVE exercise with its ACTIVE questions and types/options.
- It normalizes question options whether stored directly or embedded in content.
- The normalized data is passed to the client-side exercise engine for rendering.

```mermaid
flowchart TD
Start(["Load Exercise"]) --> Query["Query ACTIVE exercise + questions"]
Query --> Found{"Exercise found?"}
Found --> |No| NotFound["404 Not Found"]
Found --> |Yes| Normalize["Normalize options<br/>direct or embedded JSON"]
Normalize --> Render["Pass data to client renderer"]
Render --> End(["Ready"])
```

**Diagram sources**
- [page.tsx:47-91](file://english_pronunciation_app/frontend/src/app/exercises/[id]/page.tsx#L47-L91)

**Section sources**
- [page.tsx:47-91](file://english_pronunciation_app/frontend/src/app/exercises/[id]/page.tsx#L47-L91)

### Interactive Rendering Pipeline
- The UI renders question types and interactive controls.
- For voice tasks, the waveform recorder captures audio and provides real-time RMS-based feedback.
- For speech tasks, the speech recognition hook provides transcript and correctness hints.

```mermaid
sequenceDiagram
participant UI as "UI"
participant WF as "Waveform Recorder<br/>useWaveformRecorder.ts"
participant SR as "Speech Recognition<br/>useSpeechRecognition.ts"
participant BTN as "RecordButton.tsx"
UI->>WF : Initialize WaveSurfer + Record plugin
UI->>SR : Initialize SpeechRecognition
BTN->>WF : start()/stop() on user action
WF-->>UI : RMS level + waveform
BTN->>SR : startListening()
SR-->>UI : transcript + correctness
```

**Diagram sources**
- [useWaveformRecorder.ts:29-139](file://english_pronunciation_app/frontend/src/hooks/useWaveformRecorder.ts#L29-L139)
- [useSpeechRecognition.ts:15-110](file://english_pronunciation_app/frontend/src/hooks/useSpeechRecognition.ts#L15-L110)
- [RecordButton.tsx:10-129](file://english_pronunciation_app/frontend/src/components/audio/RecordButton.tsx#L10-L129)

**Section sources**
- [useWaveformRecorder.ts:29-139](file://english_pronunciation_app/frontend/src/hooks/useWaveformRecorder.ts#L29-L139)
- [useSpeechRecognition.ts:15-110](file://english_pronunciation_app/frontend/src/hooks/useSpeechRecognition.ts#L15-L110)
- [RecordButton.tsx:10-129](file://english_pronunciation_app/frontend/src/components/audio/RecordButton.tsx#L10-L129)

### Speech Recording and Audio Capture
- Microphone access is requested and managed by the recorder hook.
- Real-time RMS analysis drives waveform color feedback to guide pronunciation effort.
- On stop, the recording state is finalized for submission.

```mermaid
flowchart TD
Init["Initialize WaveSurfer + Record Plugin"] --> Start["Start Mic"]
Start --> Monitor["Monitor RMS & Update Waveform Color"]
Monitor --> Stop["Stop Mic"]
Stop --> Finalize["Finalize Recording State"]
```

**Diagram sources**
- [useWaveformRecorder.ts:99-139](file://english_pronunciation_app/frontend/src/hooks/useWaveformRecorder.ts#L99-L139)

**Section sources**
- [useWaveformRecorder.ts:29-139](file://english_pronunciation_app/frontend/src/hooks/useWaveformRecorder.ts#L29-L139)

### AI-Assisted Assessment and Scoring Engine
- The scoring engine evaluates each question according to type:
  - Multiple choice and single-select variants
  - Multi-select (comma-separated answers)
  - Tap stress (index-based selection)
  - Voice/transcript scoring with word overlap accuracy and thresholds
- Results include correctness, score, accuracy, feedback, and timing.

```mermaid
flowchart TD
Q["Question + Answer Input"] --> Type{"Question Type"}
Type --> |MC/Single| MC["Multiple Choice Scoring"]
Type --> |MultiSelect| MS["Multi-Select Scoring"]
Type --> |Tap Stress| TS["Tap Stress Scoring"]
Type --> |Voice| VO["Voice Transcript Scoring<br/>Overlap Accuracy ≥ 80%"]
MC --> R["QuestionScoreResult"]
MS --> R
TS --> R
VO --> R
```

**Diagram sources**
- [scoring.ts:74-201](file://english_pronunciation_app/frontend/src/lib/scoring.ts#L74-L201)

**Section sources**
- [scoring.ts:191-226](file://english_pronunciation_app/frontend/src/lib/scoring.ts#L191-L226)

### Gamification Data Flow (XP, Streaks, Leaderboard)
- XP rewards are computed based on exercise score, attempt history, and daily completion bonuses.
- Leaderboard entries are upserted per period (weekly/monthly) with score deltas.
- Badges are checked and awarded based on user statistics and targets.

```mermaid
sequenceDiagram
participant API as "Submission API"
participant G as "Gamification"
participant DB as "Prisma/DB"
API->>G : calculateExerciseRewards(input)
G-->>API : {xpEarned, rankingDelta, ...}
API->>DB : Upsert leaderboard entries
API->>DB : Update user XP/level
API->>DB : checkAndAwardBadges(userId)
DB-->>API : Awarded badges
```

**Diagram sources**
- [route.ts:172-266](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L172-L266)
- [gamification.ts:195-234](file://english_pronunciation_app/frontend/src/lib/gamification.ts#L195-L234)

**Section sources**
- [gamification.ts:195-234](file://english_pronunciation_app/frontend/src/lib/gamification.ts#L195-L234)
- [route.ts:172-266](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L172-L266)

### Database Transaction Flow
- The submission endpoint wraps all writes in a single Prisma transaction:
  - Creates exercise attempt with nested question attempts
  - Updates user XP and level
  - Upserts daily activity metrics
  - Upserts leaderboard entries for applicable periods
  - Awards badges if conditions are met

```mermaid
erDiagram
USER {
string id PK
int xp
int level
int streakCount
int longestStreak
}
EXERCISE {
string id PK
string name
string description
enum status
}
EXERCISE_ATTEMPT {
string id PK
string name
enum status
int attemptCount
int score
string userId FK
string exerciseId FK
}
QUESTION_ATTEMPT {
string id PK
string questionId
string transcript
string selectedOptionId
boolean isCorrect
int score
int accuracyScore
string feedback
string audioUrl
int timeSpent
string exerciseAttemptId FK
}
DAILY_ACTIVITY {
string userId PK,FK
date date PK
int completedExercises
int xpEarned
}
LEADERBOARD {
string userId PK,FK
enum type
string period PK
int score
int correctAnswers
int completedExercises
}
USER_BADGE {
string userId PK,FK
string badgeId PK,FK
string validPeriod
}
EXERCISE ||--o{ EXERCISE_ATTEMPT : "has"
EXERCISE_ATTEMPT ||--o{ QUESTION_ATTEMPT : "contains"
USER ||--o{ EXERCISE_ATTEMPT : "submits"
USER ||--o{ DAILY_ACTIVITY : "tracked_by"
USER ||--o{ LEADERBOARD : "ranked_in"
USER ||--o{ USER_BADGE : "owns"
```

**Diagram sources**
- [route.ts:182-274](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L182-L274)

**Section sources**
- [route.ts:182-274](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L182-L274)

### API Request-Response Cycle
- The submission endpoint validates the payload, authenticates the user, loads the exercise, scores answers, computes rewards, and persists results in a transaction.
- Returns a structured response with attempt summary, rewards, progress, and badges.

```mermaid
sequenceDiagram
participant C as "Client"
participant R as "Route /api/exercises/submit"
participant P as "Prisma"
participant S as "Scoring"
participant G as "Gamification"
C->>R : POST {exerciseId, answers[], timestamps}
R->>R : Validate + auth
R->>P : Load exercise + user
R->>S : scoreQuestion(...) for each
S-->>R : QuestionScoreResult[]
R->>G : calculateExerciseRewards(...)
G-->>R : Rewards + leaderboard deltas
R->>P : $transaction (attempt + user + daily + leaderboard + badges)
P-->>R : Persisted results
R-->>C : {success, data}
```

**Diagram sources**
- [route.ts:47-331](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L47-L331)

**Section sources**
- [route.ts:47-331](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L47-L331)

### Real-Time Data Synchronization Patterns
- The frontend uses optimistic UI updates during recording and submission.
- Leaderboard and progress indicators are refreshed after successful submission.
- Periodic client-side refresh can be used to keep daily totals and rankings current.

[No sources needed since this section provides general guidance]

## Dependency Analysis
- Frontend depends on Prisma for database access and on local libraries for scoring and gamification.
- Backend provides minimal endpoints; most logic is client-driven.
- Database connectivity is configured via environment variables and validated at runtime.

```mermaid
graph LR
Config["Settings<br/>config.py"] --> FastAPI["FastAPI App<br/>main.py"]
DBLayer["Database Engine<br/>database.py"] --> FastAPI
Prisma["Prisma Client<br/>prisma.ts"] --> Route["Submission Route<br/>route.ts"]
Scoring["Scoring Logic<br/>scoring.ts"] --> Route
Gamification["Gamification<br/>gamification.ts"] --> Route
Route --> Postgres["PostgreSQL"]
```

**Diagram sources**
- [config.py:9-33](file://english_pronunciation_app/backend/app/core/config.py#L9-L33)
- [database.py:10-50](file://english_pronunciation_app/backend/app/core/database.py#L10-L50)
- [main.py:10-42](file://english_pronunciation_app/backend/app/main.py#L10-L42)
- [prisma.ts:1-13](file://english_pronunciation_app/frontend/src/lib/prisma.ts#L1-L13)
- [route.ts:47-331](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L47-L331)
- [scoring.ts:191-226](file://english_pronunciation_app/frontend/src/lib/scoring.ts#L191-L226)
- [gamification.ts:195-234](file://english_pronunciation_app/frontend/src/lib/gamification.ts#L195-L234)

**Section sources**
- [config.py:9-33](file://english_pronunciation_app/backend/app/core/config.py#L9-L33)
- [database.py:10-50](file://english_pronunciation_app/backend/app/core/database.py#L10-L50)
- [main.py:10-42](file://english_pronunciation_app/backend/app/main.py#L10-L42)
- [prisma.ts:1-13](file://english_pronunciation_app/frontend/src/lib/prisma.ts#L1-L13)
- [route.ts:47-331](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L47-L331)
- [scoring.ts:191-226](file://english_pronunciation_app/frontend/src/lib/scoring.ts#L191-L226)
- [gamification.ts:195-234](file://english_pronunciation_app/frontend/src/lib/gamification.ts#L195-L234)

## Performance Considerations
- Minimize database round-trips by batching reads/writes within transactions.
- Use client-side caching for static exercise content to reduce load times.
- Optimize waveform rendering by limiting DOM updates and canceling animation frames on unmount.
- Apply debounced submission to avoid rapid retries and reduce server load.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Authentication failures: Ensure the user session exists and the request includes proper credentials.
- Validation errors: Verify exerciseId, answers array, and each answer’s questionId belong to the exercise.
- Database connectivity: Confirm DATABASE_URL and environment configuration; use the health endpoint to validate.
- Speech recognition unsupported: Check browser support and permissions; fallback UI should inform users.
- Transaction failures: Inspect the transaction block for constraint violations or missing relations.

**Section sources**
- [route.ts:53-118](file://english_pronunciation_app/frontend/src/app/api/exercises/submit/route.ts#L53-L118)
- [main.py:34-42](file://english_pronunciation_app/backend/app/main.py#L34-L42)
- [useSpeechRecognition.ts:25-41](file://english_pronunciation_app/frontend/src/hooks/useSpeechRecognition.ts#L25-L41)

## Conclusion
Web_HoTroPhatAmEN implements a clean separation of concerns: the frontend renders interactive exercises, captures speech/audio, and orchestrates scoring and gamification; the backend provides lightweight infrastructure; and the database persists all state in atomic transactions. The data flow ensures correctness, scalability, and a responsive user experience through optimized client-server interactions and pragmatic real-time patterns.