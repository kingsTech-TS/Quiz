<div align="center">

# 🎓 Quiz Platform Frontend

**Next.js 16 • React 19 • TypeScript • Tailwind CSS v4 • Bun • TanStack Query**

_A modern, responsive academic quiz and assessment examination platform built with the QUZIY design system._

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat-square&logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Bun](https://img.shields.io/badge/Bun-v1.3-FBF0DF?style=flat-square&logo=bun&logoColor=black)](https://bun.sh/)

[Overview](#-overview) •
[Features](#-features) •
[Design System](#-design-system) •
[Tech Stack](#-tech-stack) •
[Project Structure](#-project-structure) •
[Getting Started](#-getting-started) •
[Route Inventory](#-route-inventory)

</div>

---

## 📌 Overview

The **Quiz Platform Frontend** is the user-facing web application for an academic assessment and past-question practice ecosystem. It provides customized experiences for three distinct user roles:

- **Students (`user`)**: Take timed GST mock examinations, track live performance metrics, review historical attempts, and check the top 10 global leaderboard.
- **Quiz Masters (`quiz_master`)**: Create courses, upload PDF/DOCX past-question documents for AI parsing, verify and edit question banks with bulk-verification actions, manage publication lifecycles, and delete courses.
- **Administrators (`admin`)**: Supervise platform statistics, inspect student enrollments, search and filter users by faculty/department/level, and export data in CSV/XLSX formats.

---

## ✨ Features

### 👨‍🎓 Student Portal

- **Dashboard Hub**: Calendar widget, top 10 ranked student leaderboard, registered GST course list, and quick exam launch.
- **Interactive Quiz Engine**:
  - Timed server-synchronized test sessions with auto-expiry.
  - Question pagination with instant answer selection and check.
  - Real-time score tabulation with immediate feedback.
- **Attempt History & Detailed Breakdown**: Review correct vs. incorrect answers with explanations for completed exams.
- **Student Onboarding**: First-time student GST selection and profile completion.

### 👩‍🏫 Quiz Master (Instructor) Portal

- **Course Bank Management**:
  - Full inventory of created GST assessment banks with status filters (`draft`, `processing`, `review`, `published`, `archived`).
  - Single-click course publication and archival guardrails.
  - Safe course deletion with cascade warning confirmation dialogs.
- **Document Ingestion**:
  - PDF and DOCX past papers upload.
  - Real-time processing status polling via TanStack Query.
- **Question Bank & AI Verification**:
  - Interactive Question Editor (edit prompt, options, explanation, answer key).
  - Individual question verification toggle.
  - **Bulk Question Verification (`Verify All`)**: Single-click verification for all standard items while preserving flagged low-confidence items for manual review.
  - Reorder questions, add manual questions, and remove invalid items.
- **Performance Analytics**: Course-level average score, pass rates, question difficulty metrics, and student attempts.

### 🛡️ Admin Portal

- **System Metrics**: Platform-wide totals for students, instructors, courses, and completed quizzes.
- **User Directory**: Search and filter students by name, matric number, level, faculty, department, or GST tag.
- **Data Exporting**: Instant export of student registries to CSV and Excel (XLSX).
- **Quiz Master Registry**: Directory of registered instructors and course generation totals.

---

## 🎨 Design System

The application implements the **QUZIY** design language:

- **Card Enclosures**: Clean white cards with `rounded-[28px]` and `rounded-[32px]` containers over a soft neutral background (`#F4F5FA`).
- **Pill Badges**: Status tags (`rounded-full`) for publication states, verification flags, and GST codes.
- **Buttons & Micro-interactions**: Smooth pill action buttons with `rounded-full`, subtle hover transitions, and spinner feedback.
- **Responsive 3-Column Workspace**:
  - **Left Sidebar**: Desktop navigation sidebar with role-aware navigation links.
  - **Center Canvas**: Main content viewport designed for maximum focus and readability.
  - **Right Panel**: Instructor/Student details, live monthly calendar, and dynamic top 10 student leaderboard.
  - **Mobile Drawer**: Responsive navigation drawer accessible via mobile top bar.

---

## 🛠️ Tech Stack

| Layer                     | Technologies                                                                |
| ------------------------- | --------------------------------------------------------------------------- |
| **Framework**             | [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)                   |
| **Core Library**          | [React 19](https://react.dev/)                                              |
| **Language**              | [TypeScript 5](https://www.typescriptlang.org/)                             |
| **Styling**               | [Tailwind CSS v4](https://tailwindcss.com/) with Vanilla CSS variables      |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query)                       |
| **HTTP Client**           | [Axios](https://axios-http.com/) with JWT interceptors                      |
| **Forms & Validation**    | [React Hook Form](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) |
| **UI Icons**              | [Lucide React](https://lucide.dev/)                                         |
| **Toast Alerts**          | [Sonner](https://sonner.emilkowal.ski/)                                     |
| **Package Manager**       | [Bun](https://bun.sh/)                                                      |

---

## 📂 Project Structure

```
quiz/
├── app/                                # Next.js App Router root
│   ├── (auth)/                         # Authentication route group
│   │   ├── login/                      # Student & QM login
│   │   ├── register/                   # Student registration (9-digit matric)
│   │   └── quiz-master-register/       # Quiz Master registration
│   ├── (student)/                      # Student portal route group
│   │   ├── dashboard/                  # Student home dashboard
│   │   ├── courses/                    # Course browse & launch
│   │   ├── onboarding/                 # Initial GST course selection
│   │   ├── profile/                    # Student profile & settings
│   │   ├── quiz/[courseId]/            # Active quiz test runner
│   │   └── results/                    # Historical test attempt scores
│   ├── (quiz-master)/                  # Quiz Master portal route group
│   │   └── qm/
│   │       ├── dashboard/              # Instructor overview
│   │       ├── courses/                # Course inventory & list
│   │       │   ├── create/             # Create course assessment
│   │       │   └── [courseId]/         # Course management hub
│   │       │       ├── questions/      # Question Bank & Editor (Verify All)
│   │       │       ├── review/         # AI verification center
│   │       │       └── upload/         # Past-question document upload
│   │       ├── analytics/              # Instructor course analytics
│   │       └── profile/                # Quiz Master profile
│   ├── (admin)/                        # Administrator portal route group
│   │   └── admin/
│   │       ├── dashboard/              # Admin KPIs & metrics
│   │       ├── users/                  # User management & CSV export
│   │       ├── quiz-masters/           # Quiz Master accounts
│   │       ├── analytics/              # Platform-wide analytics
│   │       └── profile/                # Admin profile
│   ├── 403/                            # Access Forbidden error page
│   ├── layout.tsx                      # Root HTML layout & font definitions
│   └── page.tsx                        # Root landing page / route redirector
│
├── src/
│   ├── components/                     # Reusable React components
│   │   ├── auth/                       # Login & Register forms
│   │   ├── courses/                    # Course cards & creation forms
│   │   ├── dashboard/                  # Welcome & calendar widgets
│   │   ├── layout/                     # Sidebar, RightPanel, MobileHeader
│   │   ├── questions/                  # QuestionItem, Editor, List
│   │   ├── quiz/                       # Quiz question, timer, controls
│   │   ├── shared/                     # PageHeader, ConfirmDialog, Skeletons
│   │   └── upload/                     # Document uploader & status
│   ├── hooks/                          # Custom React Query hooks
│   │   ├── use-auth.ts                 # User authentication & session
│   │   ├── use-courses.ts              # Courses, leaderboard, analytics
│   │   ├── use-quiz.ts                 # Quiz session state & submission
│   │   ├── use-quiz-master.ts          # QM actions, verify-all, mutations
│   │   └── use-admin.ts                # User exports & admin stats
│   ├── lib/                            # Shared utilities & configurations
│   │   ├── api.ts                      # Axios instance & error mappers
│   │   ├── auth.ts                     # JWT storage & token decode
│   │   ├── constants.ts                # API endpoints & query keys
│   │   ├── query-client.ts             # TanStack Query client setup
│   │   └── utils.ts                    # Class name merge utilities (cn)
│   ├── services/                       # API HTTP service layer
│   └── types/                          # TypeScript definitions & models
│
├── .env.local                          # Environment variables
├── next.config.ts                      # Next.js configuration
└── package.json                        # Project dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.0 or higher
- **Bun**: v1.1 or higher (recommended) or `npm`/`pnpm`/`yarn`
- **FastAPI Backend (`quiz-BD`)**: `https://quiz-bd-g5de.onrender.com` (or local `http://localhost:8000`)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/quiz.git
cd quiz
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` or `.env` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://quiz-bd-g5de.onrender.com
```

### 4. Run Development Server

```bash
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 5. Build for Production

```bash
bun run build
bun run start
```

---

## 🌐 Route Inventory

| Route                              | Access Role | Description                                            |
| ---------------------------------- | ----------- | ------------------------------------------------------ |
| `/`                                | Public      | Automatic redirect to Dashboard or Login               |
| `/login`                           | Public      | Sign in for Students, Quiz Masters, and Admins         |
| `/register`                        | Public      | Student registration (9-digit matric number)           |
| `/quiz-master-register`            | Public      | Quiz Master application and registration               |
| `/dashboard`                       | Student     | Primary dashboard with Calendar and Top 10 Leaderboard |
| `/onboarding`                      | Student     | First-time GST course enrollment                       |
| `/courses`                         | Student     | Enrolled GST courses catalogue                         |
| `/courses/[courseId]`              | Student     | Course launchpad & instructions                        |
| `/quiz/[courseId]`                 | Student     | Timed quiz examination session                         |
| `/results`                         | Student     | Quiz history and performance breakdown                 |
| `/results/[attemptId]`             | Student     | Granular review for a specific test attempt            |
| `/profile`                         | Student     | Student details, matric number, level, and faculty     |
| `/qm/dashboard`                    | Quiz Master | Instructor overview & active assessments               |
| `/qm/courses`                      | Quiz Master | All instructor courses with delete and manage actions  |
| `/qm/courses/create`               | Quiz Master | Create new course assessment                           |
| `/qm/courses/[courseId]`           | Quiz Master | Assessment detail, stats, publish, archive, and delete |
| `/qm/courses/[courseId]/upload`    | Quiz Master | Syllabus and past question document upload             |
| `/qm/courses/[courseId]/questions` | Quiz Master | Question Bank, inline editor, and **Verify All**       |
| `/qm/courses/[courseId]/review`    | Quiz Master | AI extraction confidence verification center           |
| `/qm/analytics`                    | Quiz Master | Assessment performance insights and metrics            |
| `/qm/profile`                      | Quiz Master | Instructor credentials and profile                     |
| `/admin/dashboard`                 | Admin       | Administrative platform KPIs and metrics               |
| `/admin/users`                     | Admin       | Student registry with filters and CSV/XLSX export      |
| `/admin/quiz-masters`              | Admin       | Registered quiz master accounts and courses            |
| `/admin/analytics`                 | Admin       | University-wide enrollment and performance breakdown   |
| `/admin/profile`                   | Admin       | System administrator profile                           |
| `/403`                             | Public      | Unauthorized access page                               |

---

## 📜 Available Scripts

| Command         | Action                                                                     |
| --------------- | -------------------------------------------------------------------------- |
| `bun run dev`   | Starts the Next.js Turbopack development server on `http://localhost:3000` |
| `bun run build` | Validates TypeScript and generates an optimized production build           |
| `bun run start` | Launches the built production application                                  |
| `bun run lint`  | Runs ESLint to identify code quality and style errors                      |

---

<div align="center">
  <sub>Built with ❤️ for academic excellence. Powered by king'sTech.</sub>
</div>
