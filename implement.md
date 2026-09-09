# Academic Quiz Platform — Frontend Implementation Plan

A complete, production-ready Next.js 16 frontend for an Academic Quiz / Past Questions Platform, integrating strictly with a FastAPI backend.

---

## Overview

**Goal:** Build a real, backend-connected frontend — not a prototype — that works for three distinct user roles: `user` (student), `quiz_master`, and `admin`.

**Key Constraints:**
- No gradients, no emojis, no fake data, no hardcoded API URL
- All data comes from the FastAPI backend
- Backend is the source of truth for scores, correctness, and authorization
- Clean, institutional, academic SaaS design

---

## Technology Stack

| Concern | Library |
|---|---|
| Framework | Next.js 16.3.4 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Component Library | shadcn/ui |
| Server State | TanStack Query (React Query) |
| HTTP Client | Axios |
| Forms | React Hook Form |
| Validation | Zod |
| Icons | Lucide React |
| Notifications | Sonner |

The project already has Next.js 16.3.4, React 19, and Tailwind CSS v4 installed. Additional packages (shadcn/ui, TanStack Query, Axios, React Hook Form, Zod, Lucide, Sonner) must be installed.

---

## Proposed Changes

### Phase 1 — Foundation & Infrastructure

**NEW .env.local**
- NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
- Never committed to git (.gitignore already present)

**NEW .env.example**
- NEXT_PUBLIC_API_BASE_URL=

**MODIFY package.json**
Install:
- @tanstack/react-query
- axios
- react-hook-form
- @hookform/resolvers
- zod
- lucide-react
- sonner
- shadcn/ui and peer dependencies

**NEW src/lib/api.ts**
Centralized Axios instance:
```ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});
```
- Request interceptor: attaches Bearer token
- Response interceptor: handles 401 — clear auth state — redirect /login

**NEW src/lib/query-client.ts**
- TanStack Query QueryClient singleton

**NEW src/lib/constants.ts**
- GST codes: GST_112, GST_116, GST_118, GST_212
- API_ENDPOINTS constants object

**NEW src/lib/utils.ts**
- Shared utility functions (cn, date formatting, time formatting)

**NEW src/lib/auth.ts**
- Token storage helpers (get/set/clear)

---

### Phase 2 — TypeScript Types

**NEW src/types/auth.ts**
```ts
type UserRole = "user" | "quiz_master" | "admin";
interface LoginRequest { email: string; password: string; }
interface LoginResponse { access_token: string; token_type: string; user: User; }
```

**NEW src/types/user.ts**
```ts
interface User {
  id: string; full_name: string; email?: string;
  matric_number?: string; level?: string; faculty?: string;
  department?: string; phone?: string; role: UserRole;
  gst_courses?: string[];
}
```

**NEW src/types/course.ts**
```ts
type CourseStatus = "draft" | "processing" | "review" | "published" | "expired" | "archived";
interface Course {
  id: string; title: string; description: string; gst_code: string;
  duration_minutes: number; status: CourseStatus; question_count?: number;
}
```

**NEW src/types/question.ts**
```ts
// Quiz master view — includes answer key
interface Question {
  id: string; course_id: string; question_number: number;
  question_text: string; options: Record<string, string>;
  correct_answer?: string; correct_answer_text?: string;
  explanation?: string; confidence?: number;
  needs_review?: boolean; review_reason?: string | null;
}

// Student/quiz view — answer key NEVER exposed
interface PublicQuestion {
  id: string; question_number: number;
  question_text: string; options: Record<string, string>;
}
```

**NEW src/types/quiz.ts**
```ts
interface QuizAttempt {
  id: string; course_id: string; started_at: string;
  expires_at: string; status: string;
}
interface QuizResult {
  attempt_id: string; score: number; percentage: number;
  correct_count: number; incorrect_count: number;
  time_taken: number; submitted_at: string;
}
```

**NEW src/types/admin.ts**
```ts
interface AdminAnalytics {
  total_users: number; total_quiz_masters: number;
  total_courses: number; published_courses: number;
  total_attempts: number; total_questions: number;
}
```

---

### Phase 3 — API Services

All services use the centralized Axios instance. No raw Axios calls in page components.

**NEW src/services/auth.service.ts**
- login(email, password)
- registerUser(payload) — student registration
- registerQuizMaster(payload) — quiz master registration

**NEW src/services/user.service.ts**
- getMe() — GET /api/users/me
- updateGSTs(gst_codes) — onboarding endpoint

**NEW src/services/course.service.ts**
- getCourses() — student: published courses matching GSTs
- getCourse(courseId)
- createCourse(payload) — quiz master
- updateCourse(courseId, payload)
- publishCourse(courseId)
- archiveCourse(courseId)

**NEW src/services/quiz.service.ts**
- startQuiz(courseId)
- getQuestion(attemptId, questionNumber)
- checkAnswer(attemptId, questionId, answer)
- submitQuiz(attemptId, answers)
- getResult(attemptId)
- getResults() — attempt history

**NEW src/services/quiz-master.service.ts**
- uploadDocument(courseId, file) — multipart/form-data
- getProcessingStatus(jobId) — used for polling
- getQuestions(courseId)
- updateQuestion(questionId, payload)
- deleteQuestion(questionId)
- verifyQuestion(questionId)
- getAnalytics(courseId)
- getLeaderboard(courseId)

**NEW src/services/admin.service.ts**
- getUsers(params) — search, filter, pagination
- exportUsers() — triggers file download
- getQuizMasters()
- getAnalytics() — GET /api/admin/analytics

---

### Phase 4 — TanStack Query Hooks

**NEW src/hooks/use-auth.ts**
```ts
useAuth() => { user, isAuthenticated, isLoading, login(), logout() }
```
Single source of truth for auth state.

**NEW src/hooks/use-user.ts**
- useCurrentUser() — query key: ["me"]

**NEW src/hooks/use-courses.ts**
- useCourses() — ["courses"]
- useCourse(courseId) — ["courses", courseId]

**NEW src/hooks/use-quiz.ts**
- useQuiz(courseId) — ["quiz", courseId]
- useQuizResult(attemptId) — ["result", attemptId]
- useQuizResults() — ["results"]
- Mutations: useStartQuiz(), useCheckAnswer(), useSubmitQuiz()

**NEW src/hooks/use-quiz-master.ts**
- useQuizMasterCourses() — ["qm-courses"]
- useQuestions(courseId) — ["questions", courseId]
- Mutations: useUploadDocument(), useUpdateQuestion(), usePublishCourse()

**NEW src/hooks/use-admin.ts**
- useAdminUsers(params) — ["admin", "users"]
- useAdminAnalytics() — ["admin", "analytics"]
- useAdminQuizMasters() — ["admin", "quiz-masters"]

---

### Phase 5 — Middleware & Route Protection

**NEW src/middleware.ts**
- /dashboard/* requires role: user
- /qm/* requires role: quiz_master
- /admin/* requires role: admin
- Unauthenticated → redirect /login
- Wrong role → redirect /403

---

### Phase 6 — App Router Pages

```
src/app/
├── layout.tsx                              [MODIFY] — QueryClient provider, Sonner toaster
├── page.tsx                                [MODIFY] — Landing page
├── 403/page.tsx                            [NEW] — Unauthorized
│
├── (auth)/
│   ├── layout.tsx                          [NEW] — Centered card layout
│   ├── login/page.tsx                      [NEW]
│   ├── register/page.tsx                   [NEW] — Student
│   └── quiz-master-register/page.tsx       [NEW]
│
├── (student)/
│   ├── layout.tsx                          [NEW] — Sidebar layout
│   ├── onboarding/page.tsx                 [NEW] — GST multi-select
│   ├── dashboard/page.tsx                  [NEW]
│   ├── courses/page.tsx                    [NEW]
│   ├── courses/[courseId]/page.tsx         [NEW]
│   ├── quiz/[courseId]/page.tsx            [NEW]
│   ├── results/page.tsx                    [NEW]
│   ├── results/[attemptId]/page.tsx        [NEW]
│   └── profile/page.tsx                    [NEW]
│
├── (quiz-master)/
│   ├── layout.tsx                          [NEW]
│   ├── qm/dashboard/page.tsx               [NEW]
│   ├── qm/courses/page.tsx                 [NEW]
│   ├── qm/courses/create/page.tsx          [NEW]
│   ├── qm/courses/[courseId]/page.tsx      [NEW]
│   ├── qm/courses/[courseId]/upload/page.tsx  [NEW]
│   ├── qm/courses/[courseId]/questions/page.tsx [NEW]
│   ├── qm/courses/[courseId]/review/page.tsx   [NEW]
│   ├── qm/analytics/page.tsx               [NEW]
│   └── qm/profile/page.tsx                 [NEW]
│
└── (admin)/
    ├── layout.tsx                           [NEW]
    ├── admin/dashboard/page.tsx             [NEW]
    ├── admin/users/page.tsx                 [NEW]
    ├── admin/quiz-masters/page.tsx          [NEW]
    ├── admin/analytics/page.tsx             [NEW]
    └── admin/profile/page.tsx              [NEW]
```

---

### Phase 7 — Components

**src/components/layout/**
- Sidebar — role-aware nav, Sheet/drawer on mobile
- DashboardLayout — sidebar + main
- MobileHeader — hamburger trigger
- NavItem — navigation link

**src/components/auth/**
- LoginForm
- StudentRegisterForm — 9-digit matric Zod validation
- QuizMasterRegisterForm
- AuthCard — reusable wrapper

**src/components/dashboard/**
- StatsGrid — stat cards from API only
- StatCard
- WelcomeHeader
- RecentAttempts
- QuickActions

**src/components/courses/**
- CourseCard — title, GST, duration, question count
- CourseList
- CourseStatusBadge
- CourseFilters
- CreateCourseForm

**src/components/quiz/**
- QuizHeader — title, question number, progress, timer
- QuizTimer — countdown from expires_at, auto-submit on expiry
- QuestionCard — question text + radio options
- QuestionNavigator — grid (current/answered/unanswered)
- AnswerFeedback — correct/incorrect + explanation from backend
- QuizSubmitButton — disabled during submission

**src/components/questions/**
- QuestionList — search, filter, pagination
- QuestionItem — card with confidence, review badge
- QuestionEditor — edit text, options, correct answer, explanation
- ReviewBadge — "Needs Review" / "Verified"

**src/components/upload/**
- DocumentUploader — drag-and-drop + file picker
- UploadProgress
- ProcessingStatus — polls job until terminal state

**src/components/admin/**
- UserTable — search, filter, pagination
- ExportButton — triggers server file download
- QuizMasterTable
- AdminStatGrid

**src/components/shared/**
- PageHeader — title + optional breadcrumb
- EmptyState — icon (Lucide) + message, no emoji
- LoadingSkeleton — per-component
- ErrorState
- ConfirmDialog
- DataTable — reusable

---

### Phase 8 — Landing Page

Sections (no gradients, no emojis, no fake statistics):
1. Navigation — logo + Login/Register links
2. Hero — "Practice. Learn. Measure your progress."
3. How it works — upload, extract, review, publish, quiz
4. Features — Lucide icons, clean list
5. Student experience
6. Quiz master experience
7. Administrative capabilities
8. Call to action
9. Footer

---

### Phase 9 — Error Handling

Centralized Axios error handler handles:
- 400 — field-level messages
- 401 — clear token, redirect /login
- 403 — redirect /403
- 404 — not-found state
- 409 — conflict toast
- 422 — extract FastAPI detail[] array, map to form field errors
- 429 — rate limit toast
- 500 — generic server error toast

---

### Phase 10 — Forms & Validation (Zod Schemas)

**Student Registration:**
```ts
z.object({
  full_name: z.string().min(1),
  matric_number: z.string().regex(/^\d{9}$/, "Must be exactly 9 digits"),
  level: z.string().min(1),
  faculty: z.string().min(1),
  department: z.string().min(1),
  phone: z.string().min(1),
  password: z.string().min(8),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});
// confirm_password NOT sent to backend
```

**Quiz Master Registration:**
```ts
z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  confirm_password: z.string(),
}).refine(...)
```

**Course Creation:**
```ts
z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration_minutes: z.number().int().positive(),
  gst_code: z.string().min(1),
})
```

---

## Design System

- **Font:** Inter (from Google Fonts)
- **Background:** neutral-50 / white surfaces
- **Text:** neutral-900 / neutral-600
- **Primary brand color:** blue-700 (one color, no gradients)
- **Borders:** neutral-200 (subtle)
- **Shadows:** shadow-sm only where necessary
- **No gradients anywhere in the application**
- **Course status badges:** Draft, Processing, Review, Published, Expired, Archived
- **Animations:** Only on modals, sidebar, toasts, loading — nothing decorative

---

## Quiz Security Rules

- PublicQuestion type NEVER contains correct_answer, correct_answer_text, confidence, review_reason
- Score is NEVER calculated on the frontend
- Timer uses started_at / expires_at from backend — not a frontend-only countdown
- Submit button disabled while request is in-flight (prevents duplicate submissions)
- User cannot modify attempt_id or user_id
- No R2 credentials in frontend environment variables

---

## Verification Plan

### Build Verification
```bash
npm run lint
npm run build
```

### Manual Checklist

**Authentication**
- [ ] Student registration — 9-digit matric enforced
- [ ] Quiz master registration (separate page, different endpoint)
- [ ] Login — role-based redirect
- [ ] Logout clears token
- [ ] 401 from API redirects to /login
- [ ] Accessing wrong role's route shows /403

**Student Flow**
- [ ] GST onboarding (multi-select, minimum one required)
- [ ] Dashboard shows only real API data
- [ ] Published GST-matching courses appear
- [ ] Course detail page
- [ ] Quiz starts, timer counts from expires_at
- [ ] Answers selectable, immediate feedback from backend
- [ ] Quiz submission
- [ ] Results page
- [ ] Result history

**Quiz Master Flow**
- [ ] Create course (duration_minutes field)
- [ ] Course list with status badges and state-appropriate actions
- [ ] Upload PDF/DOCX, processing status polls to terminal state
- [ ] AI-extracted questions with confidence scores
- [ ] Low-confidence questions flagged "Needs Review"
- [ ] Edit question text, options, correct answer, explanation
- [ ] Verify question
- [ ] Publish blocked if questions need review
- [ ] Analytics and leaderboard per course

**Admin Flow**
- [ ] Dashboard with backend-only analytics
- [ ] User management with search + filters (level, faculty, department, GST)
- [ ] Export users — file download from server response
- [ ] Quiz master listing

**UI Quality**
- [ ] No gradients
- [ ] No emojis
- [ ] No hardcoded or fake data
- [ ] No horizontal page overflow
- [ ] Mobile responsive (320px–430px)
- [ ] Tablet (768px–1024px)
- [ ] Desktop (1280px–1440px+)
- [ ] Loading skeletons on all API-driven screens
- [ ] Meaningful empty states on all lists
- [ ] All forms have labels (not placeholder-only)
- [ ] Accessible keyboard navigation

---

## Implementation Order

**Phase 1 — Foundation**
1. Install missing dependencies (shadcn/ui, TanStack Query, Axios, React Hook Form, Zod, Lucide, Sonner)
2. Create .env.local, .env.example
3. Initialize shadcn/ui
4. Configure TanStack Query provider in layout.tsx
5. Create Axios client with interceptors (src/lib/api.ts)
6. Create TypeScript types (src/types/)
7. Create constants.ts (GST codes, API endpoints)

**Phase 2 — Authentication**
1. Auth service + useAuth hook
2. Login page
3. Student registration page
4. Quiz master registration page
5. Middleware (role-based route protection)
6. /403 unauthorized page

**Phase 3 — Student**
1. Onboarding (GST multi-select)
2. Student dashboard
3. Course listing + course detail
4. Quiz experience (timer, navigator, answer feedback)
5. Quiz results + history
6. Student profile

**Phase 4 — Quiz Master**
1. Quiz master dashboard
2. Course creation form
3. Course management list
4. Document uploader + processing status polling
5. AI question extraction review
6. Question editor (edit, verify, delete)
7. Publish flow
8. Analytics + leaderboard

**Phase 5 — Admin**
1. Admin dashboard (API analytics only)
2. User management (search, filter, paginate)
3. User export
4. Quiz master management
5. Admin profile

**Phase 6 — Landing Page**

**Phase 7 — Polish**
- Responsive breakpoints
- Consistent loading skeletons
- Error states
- Empty states
- Accessibility audit
- ESLint + TypeScript strict compliance

**Phase 8 — Final Testing**
- Student flow: register → onboard → quiz → result
- Quiz master flow: create → upload → review → publish → student quizzes → analytics
- Admin flow: view users → export → view analytics
