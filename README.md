# Student Development Passport Portal (SIH25093 MVP)

A centralized, evidence-aware, and appropriately verified Student Development Passport system for Higher Educational Institutions. Built for the SIH 2026 Internal Hackathon.

## Project Scope
This MVP focuses on the core student record lifecycle:
```
Capture → Evidence/Self-Declaration → Routing Classification → Appropriate Review Verification → Digital Passport Ledger → Summary PDF Reports
```

### Core Features
- **Student Dashboard & Profile:** View overall statistics, declare technical skills catalog and manage external professional profile URLs (LinkedIn, GitHub, ORCID, etc.).
- **Self-Directed Learning:** Declare low-risk activities (e.g. YouTube learning, self-study) instantly to the Passport as `Self-Declared / Unverified` without clogging faculty queues.
- **Evidence Verification Routing Engine:** Co-curricular activities are routed to the Event/SIG Coordinator, projects/academic achievements are routed to Faculty/Teacher Guardian, and administrative transcripts are locked and populated by HOD.
- **Project Contribution Breakdown:** Record team projects once and log separate developer roles (e.g., Student A: Frontend, Student B: Backend) to prevent assigning all technologies to all members.
- **Institutional Authority Views:** Fully functional dashboards for assigned Faculty (assigned student list & verification queue), Event Coordinator (SIG/club participation queue), HOD/Admin (student creation registry & rules configuration), and restricted read-only overview for the Principal.
- **Print-Ready Reports:** Student reports and analytics summaries optimized using CSS print-ledger stylesheets (`@media print`) for clean margins, pagination, and official double signatures.

---

## Technical Stack
- **Frontend Framework:** Next.js (App Router, React 19, TypeScript)
- **Styling system:** Tailwind CSS v4, Lucide Icons
- **Database Engine:** SQLite (local development `dev.db`), Prisma ORM
- **Authentication:** Base64 session cookies with full RBAC auth logic in layouts and API routes

---

## Installation & Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NODE_ENV="development"
   ```

3. **Initialize SQLite Database Schema:**
   Apply Prisma models:
   ```bash
   npx prisma db push
   ```

4. **Seed Database:**
   Populate all demo profiles, departments, activity routing rules, skills catalog, and mock timelines:
   ```bash
   npx prisma db seed
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to access the application sandbox.

---

## Hackathon Demo Sandbox Credentials

The landing page features a **Quick Sandbox Access** panel. You can authenticate as any user by clicking their sandbox card, or type in these credentials:

| Institutional Role | Email Address | Password | Sandbox Mock Scenario Details |
| :--- | :--- | :--- | :--- |
| **Student (Sachin Jha)** | `sachin@sih.edu` | `sachin123` | Has profile summary, links (LinkedIn/ORCID), React self-study, verified hackathon, and pending backend contribution in "Smart Campus Platform". |
| **Student (Hritik Jha)** | `hritik@sih.edu` | `hritik123` | Member of "Smart Campus" team. Has verified Next.js workshop and verified frontend contribution. |
| **Faculty (Dr. Alok Ranjan)** | `alok@sih.edu` | `faculty123` | Teacher Guardian. Reviews project contributions and internships. |
| **Event Coordinator (Prof. Neha Sharma)** | `neha@sih.edu` | `coord123` | ACM Head. Reviews SIG chapter workshops, hackathons, and competitions. |
| **Admin / HOD (Dr. Rajesh Patil)** | `hod.cse@sih.edu` | `admin123` | CSE HOD. Creates students, configs category rules, reviews department stats. |
| **Principal (Dr. Shruti Sharma)** | `principal@sih.edu` | `principal123` | Executive restricted authority. Views institution charts and audits profiles. |

---

## Project Structure
```
/prisma
  ├── schema.prisma        # SQLite mapping of all 18 specified models
  └── seed.ts              # Seeding scenario configuration
/src
  ├── lib
  │    ├── auth.ts         # Base64 session middleware helper
  │    └── db.ts           # Prisma client instantiation
  └── app
       ├── page.tsx        # Portal landing & sandbox login selector
       ├── layout.tsx      # Global app layout
       ├── api/            # API Route handlers for auth, upload, and student data
       ├── admin/          # Admin registry, config rules, and dashboard
       ├── coordinator/    # Coordinator event participant queue
       ├── faculty/        # Faculty tg assigned cohort and review queue
       ├── principal/      # Restricted principal read-only views
       └── student/        # Student dashboard, passport, profile, and reports
```
