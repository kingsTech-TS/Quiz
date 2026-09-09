# FRONTEND DEVELOPMENT PROMPT — ACADEMIC QUIZ PLATFORM

Build a complete, production-ready frontend for an **Academic Quiz / Past Questions Platform**.

The frontend must integrate with an existing **FastAPI backend**. Do not invent API endpoints, request bodies, response structures, field names, or authentication behavior. The frontend must strictly follow the backend API contracts described below.

---

# 1. TECHNOLOGY REQUIREMENTS

Use:

- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React
- TanStack Query / React Query for server state
- Axios for API requests
- React Hook Form for forms
- Zod for client-side validation
- Lucide React for icons
- Sonner or shadcn Toast for notifications

Do NOT introduce another UI framework.

Use reusable components throughout the application.

The application must be fully responsive on:

- Mobile
- Tablet
- Laptop
- Desktop
- Large desktop screens

---

# 2. IMPORTANT DESIGN REQUIREMENTS

The application must look like a professionally designed academic SaaS product.

It must NOT look "vibecoded".

Avoid:

- Gradients
- Excessive rounded cards
- Huge text everywhere
- Excessive animations
- Random decorative elements
- Emoji
- Unnecessary glassmorphism
- Excessive shadows
- Generic AI-generated dashboard layouts
- Excessive use of cards
- Purple-gradient AI aesthetics
- Fake statistics
- Lorem ipsum
- Hardcoded API data

Use a clean, structured, institutional design.

The visual language should feel appropriate for:

- University students
- Lecturers
- Quiz masters
- Academic administrators

Use a restrained color system.

Suggested visual direction:

- Neutral background
- White surfaces
- Dark text
- One primary brand color
- Subtle borders
- Minimal shadows
- Clear typography hierarchy
- Strong spacing system

Do not use gradients anywhere.

Do not use emojis anywhere in the interface.

Use Lucide icons instead of emoji icons.

---

# 3. ENVIRONMENT VARIABLES

The API base URL MUST NOT be hardcoded.

Create:

`.env.local`

with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

The frontend API client must read:

```ts
process.env.NEXT_PUBLIC_API_BASE_URL;
```

Never write:

```ts
axios.get("http://localhost:8000/api/...");
```

Instead create a centralized API client.

Example:

```ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

The production API URL should be configurable entirely through environment variables.

Also create:

`.env.example`

containing:

```env
NEXT_PUBLIC_API_BASE_URL=
```

Never commit `.env.local`.

---

# 4. PROJECT STRUCTURE

Use a clean architecture similar to:

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── quiz-master-register/
│   │
│   ├── (student)/
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   ├── courses/
│   │   ├── courses/[courseId]/
│   │   ├── quiz/[courseId]/
│   │   ├── results/
│   │   └── profile/
│   │
│   ├── (quiz-master)/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── courses/create/
│   │   ├── courses/[courseId]/
│   │   ├── courses/[courseId]/upload/
│   │   ├── courses/[courseId]/questions/
│   │   ├── courses/[courseId]/review/
│   │   ├── analytics/
│   │   └── profile/
│   │
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── quiz-masters/
│   │   ├── analytics/
│   │   └── profile/
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── auth/
│   ├── dashboard/
│   ├── courses/
│   ├── quiz/
│   ├── questions/
│   ├── admin/
│   └── shared/
│
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── query-client.ts
│   ├── utils.ts
│   └── constants.ts
│
├── services/
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── course.service.ts
│   ├── quiz.service.ts
│   ├── quiz-master.service.ts
│   └── admin.service.ts
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-user.ts
│   ├── use-courses.ts
│   ├── use-quiz.ts
│   ├── use-quiz-master.ts
│   └── use-admin.ts
│
├── types/
│   ├── auth.ts
│   ├── user.ts
│   ├── course.ts
│   ├── question.ts
│   ├── quiz.ts
│   └── admin.ts
│
└── middleware.ts
```

Keep API communication separate from UI components.

---

# 5. BACKEND API CONTRACT

The backend uses the following three roles:

```text
user
quiz_master
admin
```

The frontend must never create additional roles.

---

# 6. AUTHENTICATION

Implement:

- Login
- User registration
- Quiz master registration
- Logout
- Current-user retrieval
- Protected routes
- Role-based route protection

The backend uses JWT authentication.

After login, store the authentication token securely according to the backend's authentication contract.

Create a centralized Axios interceptor that:

1. Adds the access token to authenticated requests.
2. Handles 401 responses.
3. Clears invalid authentication state.
4. Redirects the user to `/login`.

Do not duplicate authentication logic across pages.

---

# 7. USER REGISTRATION

Create a professional registration page.

Fields:

```text
Full Name
Matric Number
Level
Faculty
Department
Phone Number
Password
Confirm Password
```

Validation:

### Full Name

Required.

### Matric Number

Must contain exactly **9 numeric digits**.

Example:

```text
220903012
```

Validation:

```regex
^\d{9}$
```

Reject:

```text
22090301
2209030123
ABC220903
22-090-3012
```

Display a clear validation message.

### Level

Provide an appropriate level selector.

### Faculty

Text/select field.

### Department

Text/select field.

### Phone Number

Validate as a phone number.

### Password

Require a reasonable secure password.

### Confirm Password

Must match password.

Do not send `confirm_password` to endpoints that don't accept it.

Follow the exact backend schema.

---

# 8. QUIZ MASTER REGISTRATION

Create a separate registration page for quiz masters.

Fields:

```text
Full Name
Email
Password
Confirm Password
```

The backend schema is:

```text
full_name
email
password
confirm_password
```

Validate these fields before submission.

Do not allow users to select their role during normal registration.

The frontend must call the dedicated quiz-master registration endpoint.

---

# 9. LOGIN

Create a clean login page.

Fields:

```text
Email
Password
```

The login response contains authentication information including the user's role.

After login:

```text
user       → student dashboard
quiz_master → quiz master dashboard
admin       → admin dashboard
```

Do not allow users to manually access another role's dashboard.

---

# 10. AUTHENTICATION STATE

Create a central auth system.

Expose something similar to:

```ts
useAuth();
```

with:

```ts
user;
isAuthenticated;
isLoading;
login();
logout();
```

User information should contain the backend user fields.

Never duplicate user information in multiple unrelated stores.

---

# 11. CURRENT USER / PROFILE

Use:

```http
GET /api/users/me
```

for retrieving the authenticated user's profile.

Create profile pages for all roles.

---

# 12. USER ONBOARDING

After a student registers successfully, redirect them to:

```text
/onboarding
```

The student must select one or more GST courses.

Available GSTs:

```text
GST 112
GST 116
GST 118
GST 212
```

The selection is MULTI-SELECT.

Use a clean selection interface.

Example:

```text
Select your GST courses

[ ] GST 112
[ ] GST 116
[ ] GST 118
[ ] GST 212
```

The user must select at least one.

Submit the selected GST codes to the backend using the exact onboarding endpoint and schema.

Do not invent additional GST codes.

After successful onboarding:

```text
/onboarding → /dashboard
```

---

# 13. STUDENT DASHBOARD

Create a professional student dashboard.

The dashboard should show:

- Welcome message
- Selected GST courses
- Available published courses
- Recent quiz attempts
- Recent scores
- Quick actions
- Profile summary

Do not use fake statistics.

Everything must come from the API.

---

# 14. COURSE DISCOVERY

Students must only see courses that:

1. Are published.
2. Match the student's selected GSTs.
3. Are currently available according to the backend.

Do not filter this only on the frontend.

The backend is authoritative.

Create:

```text
Course Card
```

with:

- Course title
- Description
- GST
- Duration
- Question count if provided
- Availability
- Start quiz action

Use clean academic styling.

---

# 15. COURSE DETAILS

Create:

```text
/courses/[courseId]
```

Display:

- Course title
- Description
- GST
- Number of questions
- Quiz duration
- Course availability
- Instructions
- Start Quiz button

Do not expose correct answers anywhere on the course details page.

---

# 16. QUIZ EXPERIENCE

Create a focused quiz interface.

The interface should contain:

```text
Course title
Question number
Progress
Timer
Question
Answer options
Previous
Next
Submit
```

Example:

```text
Question 4 of 50

What is the primary purpose of an operating system?

○ A. Manage hardware and software resources
○ B. Design websites
○ C. Store only images
○ D. Compile only Python programs
```

Use radio/select behavior for answers.

Make the interface comfortable on mobile.

---

# 17. QUIZ TIMER

The backend controls the actual quiz duration.

The frontend should display a countdown using the backend-provided:

```text
started_at
expires_at
```

Do not trust only the frontend timer.

When the timer reaches zero:

- Disable further answering.
- Automatically submit if appropriate.
- Display an expired state.
- Let the backend determine whether submission is accepted.

Never calculate final score exclusively on the client.

---

# 18. ANSWER FEEDBACK

The platform supports immediate answer feedback while taking the quiz.

When the backend returns answer-check information:

Display:

```text
Correct
```

or:

```text
Incorrect
```

and the explanation if available.

Use subtle visual indicators.

Do not reveal more information than the backend response provides.

Do not hardcode correct answers into the frontend.

---

# 19. QUIZ SUBMISSION

When the user submits the quiz:

Send only the required answer information.

Never send:

```text
score
percentage
correct_count
incorrect_count
```

as authoritative values.

The backend must calculate those.

After submission redirect to:

```text
/results/[attemptId]
```

or the exact result endpoint supported by the backend.

---

# 20. RESULTS PAGE

Display:

- Score
- Percentage
- Correct answers
- Incorrect answers
- Time taken
- Course
- Submission date
- Question-by-question review where permitted by backend

Example:

```text
Your Result

78 / 100

78%

Correct       39
Incorrect     11

Time          32:14
```

Use clean visual hierarchy.

Do not use unnecessary charts when simple numbers communicate the information better.

---

# 21. USER RESULT HISTORY

Create:

```text
/results
```

Display previous quiz attempts.

Columns/cards:

```text
Course
Date
Score
Percentage
Status
View Result
```

Make the table horizontally scrollable on small screens or switch to responsive cards.

---

# 22. QUIZ MASTER DASHBOARD

Quiz masters need a completely different dashboard from students.

Display:

- Total courses
- Published courses
- Draft courses
- Total questions
- Total quiz participants
- Total correct answers
- Total incorrect answers
- Highest score

Only display statistics returned by the backend.

Do not manufacture statistics.

---

# 23. COURSE CREATION

Quiz masters can create courses.

Fields:

```text
Course Title
Description
Duration
GST Code(s)
```

Use the exact backend schema.

Duration should be represented in:

```text
duration_minutes
```

Do not send:

```text
duration
```

if the backend expects:

```text
duration_minutes
```

Validate duration as a positive integer.

---

# 24. COURSE MANAGEMENT

Create a quiz-master course management page.

Show:

```text
Draft
Processing
Review
Published
Expired
Archived
```

Use badges for statuses.

Provide appropriate actions:

```text
View
Edit
Upload Questions
Review Questions
Publish
Archive
```

Only show actions allowed by the course's current state.

---

# 25. DOCUMENT UPLOAD

Quiz masters upload past-question documents.

Supported backend formats may include:

```text
PDF
DOCX
```

Create a professional document uploader.

Show:

- Drag and drop
- File picker
- File name
- File size
- File type
- Upload progress
- Processing status
- Error state
- Success state

Do not upload directly to an arbitrary frontend URL.

Call the backend document upload endpoint.

The backend is responsible for Cloudflare R2 storage.

The frontend must never contain:

```text
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
```

or any other R2 credentials.

These are backend-only secrets.

---

# 26. DOCUMENT PROCESSING STATUS

After upload, display processing states:

```text
Uploading
Processing
Questions extracted
Review required
Ready to publish
Failed
```

If the backend exposes processing jobs, poll the job/status endpoint using React Query.

Do not create an infinite polling loop.

Use sensible polling intervals.

Stop polling when processing reaches a terminal state.

---

# 27. AI QUESTION EXTRACTION REVIEW

The backend extracts objective questions from uploaded documents.

AI may determine:

```text
question_text
options
correct_answer
correct_answer_text
explanation
confidence
needs_review
review_reason
```

The frontend must expose these fields where the backend permits them.

Create a question review interface.

Example:

```text
Question 12

What is a database?

A. A collection of organized data
B. An operating system
C. A programming language
D. A network cable

AI Suggested Answer:
A

Confidence:
96%

Status:
Verified
```

---

# 28. LOW-CONFIDENCE QUESTIONS

Questions requiring review must be clearly identified.

For example:

```text
Needs Review
```

or:

```text
Low Confidence
```

Display:

- Question
- Options
- Suggested answer
- Confidence
- Explanation
- Review reason

Allow the quiz master to:

- Change correct answer
- Edit question
- Edit options
- Delete question
- Verify question

Never hide review-required questions.

---

# 29. QUESTION MANAGEMENT

Quiz masters should be able to:

- View extracted questions
- Edit question text
- Edit options
- Change correct answer
- Add explanation
- Delete questions
- Reorder questions
- Add questions manually
- Verify questions

Use reusable components.

For long question lists, provide:

- Search
- Pagination where supported
- Filters
- Review status filters

---

# 30. PUBLISHING

The frontend must not assume that a course is ready for publishing.

Before displaying/enabling the Publish button, use backend state.

The UI should make it obvious when:

```text
Questions still require review
```

or:

```text
Course is ready to publish
```

If the backend rejects publishing, display the actual API error in a user-friendly manner.

---

# 31. QUIZ MASTER ANALYTICS

Create analytics for each course.

Display:

```text
Total Participants
Correct Answers
Incorrect Answers
Highest Score
Average Score
```

If the backend returns leaderboard data, show:

```text
Leaderboard

Rank | Student | Score | Percentage
```

Do not expose student information that the backend does not return.

---

# 32. ADMIN DASHBOARD

Admins should have a separate administrative interface.

Display system analytics returned from:

```text
GET /api/admin/analytics
```

Possible statistics:

```text
Total Users
Total Quiz Masters
Total Courses
Published Courses
Total Attempts
Total Questions
```

Only display fields actually returned by the API.

---

# 33. ADMIN USER MANAGEMENT

Create:

```text
/admin/users
```

Features:

- Search users
- Pagination
- Filter by level
- Filter by faculty
- Filter by department
- Filter by GST
- View user
- View user profile
- Export user data

Table columns should be appropriate for desktop.

On mobile, switch to responsive cards or a horizontally scrollable table.

---

# 34. USER EXPORT

Provide an:

```text
Export Users
```

button.

The frontend should call the backend export endpoint.

If the backend returns a file:

- Download it correctly.
- Use the server-provided filename if available.
- Do not generate fake export data on the frontend.

---

# 35. ADMIN QUIZ MASTER MANAGEMENT

Create:

```text
/admin/quiz-masters
```

Display:

- Name
- Email
- Number of courses
- Published courses
- Other backend-provided statistics

Provide only actions supported by the backend.

---

# 36. ROLE-BASED NAVIGATION

Create separate navigation systems.

### Student

```text
Dashboard
Courses
My Results
Profile
Logout
```

### Quiz Master

```text
Dashboard
Courses
Create Course
Analytics
Profile
Logout
```

### Admin

```text
Dashboard
Users
Quiz Masters
Analytics
Profile
Logout
```

Do not show admin navigation to students.

Do not show quiz-master management pages to normal users.

---

# 37. ROUTE PROTECTION

Implement role-based route protection.

Examples:

```text
/dashboard
```

requires:

```text
user
```

Quiz-master routes require:

```text
quiz_master
```

Admin routes require:

```text
admin
```

If unauthorized:

```text
403 / Unauthorized page
```

If unauthenticated:

```text
/login
```

Do not rely only on hiding navigation.

Protect the actual routes.

---

# 38. API SERVICE LAYER

Create strongly typed service functions.

Example:

```ts
authService.login();
authService.registerUser();
authService.registerQuizMaster();

userService.getMe();
userService.updateGSTs();

courseService.getCourses();
courseService.getCourse();
courseService.createCourse();

quizService.startQuiz();
quizService.checkAnswer();
quizService.submitQuiz();
quizService.getResult();

quizMasterService.uploadDocument();
quizMasterService.getQuestions();
quizMasterService.updateQuestion();
quizMasterService.publishCourse();

adminService.getUsers();
adminService.exportUsers();
adminService.getQuizMasters();
adminService.getAnalytics();
```

Do not put raw Axios calls throughout page components.

---

# 39. TYPESCRIPT TYPES

Create TypeScript interfaces/types that mirror the backend Pydantic schemas.

Examples:

```ts
type UserRole = "user" | "quiz_master" | "admin";

type CourseStatus =
  | "draft"
  | "processing"
  | "review"
  | "published"
  | "expired"
  | "archived";
```

Question types must represent the backend structure accurately.

For example:

```ts
interface Question {
  id: string;
  course_id: string;
  question_number: number;
  question_text: string;
  options: Record<string, string>;
  correct_answer?: string;
  correct_answer_text?: string;
  explanation?: string;
  confidence?: number;
  needs_review?: boolean;
  review_reason?: string | null;
}
```

IMPORTANT:

The quiz-taking API must use a separate public question type that DOES NOT contain:

```text
correct_answer
correct_answer_text
confidence
review_reason
```

Never expose answer keys to students before they answer.

---

# 40. BACKEND SCHEMA DISCIPLINE

This is extremely important.

Before implementing an API call:

1. Check the backend schema.
2. Check the HTTP method.
3. Check the endpoint.
4. Check required fields.
5. Check optional fields.
6. Check response structure.
7. Create/update the corresponding TypeScript type.
8. Then implement the frontend.

Never guess.

If the backend returns:

```json
{
  "duration_minutes": 30
}
```

use:

```ts
duration_minutes;
```

Do not rename it to:

```ts
duration;
```

unless the frontend creates a deliberate view-model conversion.

Keep API DTOs separate from UI models if transformation is necessary.

---

# 41. ERROR HANDLING

Create centralized API error handling.

Handle:

```text
400
401
403
404
409
422
429
500
```

For FastAPI validation errors such as:

```json
{
  "detail": [
    {
      "loc": ["body", "matric_number"],
      "msg": "..."
    }
  ]
}
```

extract and display useful validation messages.

Never display raw ugly backend errors if they can be converted into readable messages.

---

# 42. LOADING STATES

Every API-driven screen needs proper loading states.

Use:

- Skeletons
- Spinners where appropriate
- Disabled submit buttons
- Upload progress
- Processing indicators

Do not show blank screens while data loads.

---

# 43. EMPTY STATES

Every list needs a meaningful empty state.

Examples:

```text
No courses available yet.
```

```text
You have not completed any quizzes.
```

```text
No users match your search.
```

Do not use emojis.

---

# 44. FORM UX

All forms should have:

- Labels
- Validation
- Error messages
- Loading state
- Success state
- Disabled submit during request
- Appropriate input types
- Accessible controls

Never rely on placeholders as the only labels.

---

# 45. RESPONSIVE DESIGN

Mobile must be treated as a first-class experience.

For mobile:

- Sidebar becomes a drawer
- Tables become scrollable or cards
- Course cards stack vertically
- Quiz options are easy to tap
- Buttons should not be too small
- Forms use full width
- Dashboard statistics stack naturally
- Navigation remains usable
- Modals fit small screens
- No horizontal page overflow

Test at:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px+
```

---

# 46. ACCESSIBILITY

Implement:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Proper button semantics
- ARIA only where necessary
- Sufficient contrast
- Screen-reader-friendly forms
- Accessible dialogs
- Accessible dropdowns

Use shadcn/ui components correctly.

---

# 47. DESIGN SYSTEM

Create a consistent design system.

Use shadcn/ui for:

- Button
- Input
- Label
- Select
- Checkbox
- Radio Group
- Dialog
- Dropdown
- Sheet
- Tabs
- Badge
- Card
- Table
- Pagination
- Alert
- Progress
- Skeleton
- Tooltip

Customize them to fit the application's visual identity.

Do not blindly use default shadcn components everywhere.

---

# 48. ICONS

Use:

```text
lucide-react
```

for interface icons.

Never use emojis for:

- Dashboard icons
- Status indicators
- Navigation
- Buttons
- Empty states
- Notifications

---

# 49. ANIMATIONS

Animations should be subtle.

Use animation only when it improves UX:

- Page transitions
- Modal appearance
- Sidebar
- Loading states
- Toasts
- Progress

Do not animate every card.

Do not use excessive Framer Motion effects.

No flashy landing-page animations.

---

# 50. LANDING PAGE

Create a professional landing page for the platform.

Sections:

1. Navigation
2. Hero
3. How it works
4. Features
5. Student experience
6. Quiz master experience
7. Administrative capabilities
8. Call to action
9. Footer

The landing page should clearly explain:

```text
Practice.
Learn.
Measure your progress.
```

Do not use fake university partnerships, fake statistics, fake testimonials, or fake user counts.

No gradients.

No emojis.

---

# 51. DASHBOARD LAYOUT

Create reusable layouts.

Desktop:

```text
┌──────────────┬───────────────────────────┐
│              │                           │
│   Sidebar    │       Main Content        │
│              │                           │
│              │                           │
└──────────────┴───────────────────────────┘
```

Mobile:

```text
┌──────────────────────────┐
│ Header / Menu            │
├──────────────────────────┤
│                          │
│ Main Content             │
│                          │
└──────────────────────────┘
```

The sidebar should become a Sheet/drawer on mobile.

---

# 52. DATA FETCHING

Use TanStack Query.

Create query hooks such as:

```ts
useCurrentUser();
useCourses();
useCourse(courseId);
useQuiz(courseId);
useQuizResult(attemptId);
useQuizMasterCourses();
useQuestions(courseId);
useAdminUsers();
useAdminAnalytics();
```

Use mutations for:

```ts
useLogin();
useRegister();
useCreateCourse();
useUploadDocument();
useUpdateQuestion();
usePublishCourse();
useStartQuiz();
useCheckAnswer();
useSubmitQuiz();
```

Invalidate relevant queries after mutations.

---

# 53. CACHE MANAGEMENT

Use appropriate query keys.

Example:

```ts
["me"]["courses"][("courses", courseId)][("questions", courseId)][
  ("admin", "users")
][("admin", "analytics")];
```

Do not create random query keys throughout components.

---

# 54. SECURITY

Never place secrets in frontend environment variables.

Do NOT expose:

```text
MONGODB_URI
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
JWT_SECRET
AI_API_KEY
```

The frontend only needs the public API URL.

Never trust frontend authorization.

Never trust frontend score calculations.

Never expose correct answers before permitted.

Never store sensitive backend credentials in browser storage.

---

# 55. QUIZ SECURITY

The quiz frontend must assume that all answer validation and scoring are controlled by the backend.

The frontend must never:

- Calculate authoritative scores
- Determine official correctness
- Store an answer key
- Include correct answers in public quiz payloads
- Allow users to modify attempt ownership
- Send arbitrary user IDs

Use the authenticated backend identity.

---

# 56. NETWORK RESILIENCE

Handle:

- Slow network
- Connection failures
- Request timeouts
- Retry where appropriate
- Duplicate submissions
- Expired sessions

For quiz submission, prevent accidental duplicate submission with a mutation state.

Example:

```text
Submitting...
```

Disable the submit button until the request finishes.

---

# 57. QUIZ NAVIGATION

For quizzes with many questions, provide a question navigator.

Example:

```text
1  2  3  4  5
6  7  8  9  10
...
```

Use states such as:

- Current
- Answered
- Unanswered

Do not reveal correctness before the backend permits it.

---

# 58. PROFILE PAGE

All roles should have a profile page.

Student profile:

```text
Full Name
Matric Number
Level
Faculty
Department
Phone
Selected GSTs
```

Quiz master profile:

```text
Full Name
Email
```

Admin profile:

Use fields returned by backend.

Do not invent profile fields.

---

# 59. API INTEGRATION RULE

The API contract is the source of truth.

If there is any mismatch between this prompt and the actual backend implementation:

1. Inspect the backend Pydantic schema.
2. Inspect the backend route.
3. Inspect the response model.
4. Update the frontend types/service.
5. Do not modify the backend just to make an invented frontend schema work.

The final frontend must successfully communicate with the real backend.

---

# 60. API CONSTANTS

Centralize endpoint paths.

For example:

```ts
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    registerUser: "/api/auth/register",
    registerQuizMaster: "/api/auth/register/quiz-master",
  },

  users: {
    me: "/api/users/me",
    onboarding: "/api/users/onboarding",
  },

  courses: {
    list: "/api/courses",
    create: "/api/quiz-masters/courses",
  },
};
```

IMPORTANT:

Do not blindly assume the example paths above exist.

Verify them against the actual FastAPI backend before implementation.

---

# 61. BACKEND-FIRST INTEGRATION

Before writing the frontend API services, inspect the backend.

Determine:

```text
All routes
HTTP methods
Request schemas
Response schemas
Authentication requirements
Role requirements
Path parameters
Query parameters
File upload requirements
Error responses
```

Create a frontend API contract document internally.

Then implement the services from that contract.

Do not guess endpoint names.

---

# 62. API DEBUGGING

During development, if an API request returns:

```text
404
405
422
401
403
500
```

do not work around it by changing the frontend payload randomly.

Instead:

1. Inspect the backend route.
2. Inspect the backend Pydantic model.
3. Compare the actual request.
4. Fix the frontend request to match the backend.

For 422 errors, show useful field-level validation messages.

---

# 63. COMPONENT QUALITY

Avoid giant components.

Bad:

```text
dashboard/page.tsx
```

containing hundreds of lines of UI, API calls, state, forms and business logic.

Instead split into:

```text
DashboardHeader
StatsGrid
CourseList
CourseCard
RecentAttempts
QuickActions
```

Use reusable components.

---

# 64. NO HARDCODED BUSINESS DATA

Do not hardcode:

- Users
- Scores
- Courses
- Question counts
- Leaderboards
- Analytics
- API responses

The only fixed academic options allowed on the frontend are the backend-defined GST options:

```text
GST 112
GST 116
GST 118
GST 212
```

Even these should ideally be centralized in:

```ts
constants.ts;
```

---

# 65. TESTING

Implement tests for important functionality.

Test:

- Login
- User registration validation
- 9-digit matric validation
- Quiz-master registration
- GST onboarding
- Protected routes
- Role-based routing
- Course creation
- Quiz submission
- Error handling
- Responsive critical components

---

# 66. CODE QUALITY

Use:

- Strict TypeScript
- ESLint
- Prettier
- Clear naming
- Small reusable components
- Typed API responses
- Typed form schemas
- No unnecessary `any`
- No dead code
- No unused imports
- No console spam
- No duplicated API logic

Avoid:

```ts
any;
```

unless absolutely necessary.

---

# 67. PRODUCTION REQUIREMENTS

The final application should be production-ready.

Include:

```text
.env.example
README.md
```

README must explain:

1. Installation
2. Environment variables
3. Development
4. Production build
5. Backend API configuration
6. Authentication
7. Deployment
8. Project structure

---

# 68. ENVIRONMENT SETUP

The developer should be able to run:

```bash
npm install
npm run dev
```

and the application should start successfully.

Production:

```bash
npm run build
npm start
```

---

# 69. FINAL VALIDATION

Before considering the frontend complete, verify:

### Authentication

- [ ] User registration works
- [ ] Matric number requires exactly 9 digits
- [ ] Quiz-master registration works
- [ ] Login works
- [ ] Logout works
- [ ] 401 handling works
- [ ] Role-based routing works

### Student

- [ ] Onboarding works
- [ ] GST multi-select works
- [ ] Published GST courses load
- [ ] Course details work
- [ ] Quiz starts
- [ ] Timer works
- [ ] Answers can be selected
- [ ] Immediate answer feedback works
- [ ] Quiz submission works
- [ ] Results load
- [ ] Result history works
- [ ] Profile works

### Quiz Master

- [ ] Dashboard works
- [ ] Course creation works
- [ ] Course listing works
- [ ] Document upload works
- [ ] Processing state works
- [ ] Extracted questions load
- [ ] AI confidence is displayed where returned
- [ ] Review-required questions are obvious
- [ ] Questions can be edited
- [ ] Questions can be verified
- [ ] Course publishing works
- [ ] Analytics work
- [ ] Leaderboard works
- [ ] Profile works

### Admin

- [ ] Admin dashboard works
- [ ] Analytics work
- [ ] Users load
- [ ] Search works
- [ ] Filters work
- [ ] Pagination works
- [ ] Export works
- [ ] Quiz masters load
- [ ] Profile works

### UI

- [ ] No gradients
- [ ] No emojis
- [ ] No fake data
- [ ] No fake statistics
- [ ] No unnecessary animations
- [ ] No horizontal overflow
- [ ] Mobile responsive
- [ ] Desktop responsive
- [ ] Accessible forms
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

---

# 70. MOST IMPORTANT IMPLEMENTATION RULE

Do NOT simply build mock pages.

Build a real frontend connected to the FastAPI backend.

The final application should work as:

```text
Frontend
   ↓
NEXT_PUBLIC_API_BASE_URL
   ↓
FastAPI
   ↓
MongoDB
   ↓
Cloudflare R2
```

The frontend should NEVER communicate directly with MongoDB or Cloudflare R2.

All protected operations go through FastAPI.

---

# 71. FINAL DEVELOPMENT APPROACH

Follow this implementation order:

### Phase 1 — Foundation

- Next.js setup
- Tailwind
- shadcn/ui
- Theme/design tokens
- Axios
- TanStack Query
- Environment variables
- TypeScript types

### Phase 2 — Authentication

- Login
- User registration
- Quiz-master registration
- Auth state
- Protected routes
- Role routing

### Phase 3 — Student

- Onboarding
- Dashboard
- Courses
- Course details
- Quiz
- Timer
- Answer checking
- Submission
- Results
- Profile

### Phase 4 — Quiz Master

- Dashboard
- Course creation
- Course management
- Document upload
- Processing status
- Question extraction review
- AI answer verification
- Question editing
- Publishing
- Analytics
- Leaderboard

### Phase 5 — Admin

- Dashboard
- Analytics
- User management
- Search/filter/pagination
- Export
- Quiz-master management
- Profile

### Phase 6 — Polish

- Responsive design
- Loading states
- Error states
- Empty states
- Accessibility
- Form validation
- API error handling
- Security review

### Phase 7 — Testing

Test the complete flow:

```text
Register student
        ↓
Complete GST onboarding
        ↓
View published GST course
        ↓
Start quiz
        ↓
Answer questions
        ↓
Receive answer feedback
        ↓
Submit quiz
        ↓
View result
```

And:

```text
Register quiz master
        ↓
Create course
        ↓
Upload past-question document
        ↓
Backend extracts questions
        ↓
AI identifies answers
        ↓
Quiz master reviews questions
        ↓
Verify questions
        ↓
Publish course
        ↓
Students take quiz
        ↓
Quiz master sees analytics
```

And:

```text
Admin
 ↓
Dashboard
 ↓
Users
 ↓
Quiz Masters
 ↓
Analytics
 ↓
Export
```

---

# FINAL INSTRUCTION

Build this as a **real production frontend**, not a prototype.

Prioritize:

1. Correct backend integration
2. Correct TypeScript schemas
3. Correct API request/response handling
4. Authentication and authorization
5. Responsive UX
6. Professional academic UI
7. Accessibility
8. Maintainable architecture
9. Security
10. Clean visual design

**No gradients.
No emojis.
No fake data.
No fake API endpoints.
No hardcoded API base URL.
No hardcoded analytics.
No exposing correct answers to students.
No vibecoded UI.**

The application must feel like a serious university-grade software product built by an experienced frontend engineering team.
