# EdVisingU - Direct Impact Educational Philanthropy Platform

A modern, production-ready frontend for connecting donors directly with students for transparent educational funding.

## 🎯 Project Overview

EdVisingU is a platform that enables:
- **Students**: Create verified campaigns to fund their education
- **Donors**: Discover and support students with full transparency
- **Transparency**: Track every dollar with receipts and milestone updates

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd edvisingu

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # AppHeader, AppFooter
│   ├── ProtectedRoute.tsx  # Route authorization
│   └── ThemeToggle.tsx     # Dark/light mode toggle
├── pages/                  # Route pages
│   ├── Landing.tsx         # Homepage
│   ├── Login.tsx           # Authentication
│   ├── Register.tsx        # User registration
│   ├── Discover.tsx        # Student discovery
│   └── StudentProfile.tsx  # Student detail page
├── providers/
│   └── AuthProvider.tsx    # Authentication context
├── types/                  # TypeScript interfaces
└── lib/                    # Utilities
```

## 🎨 Design System

### Colors

- **Primary**: Deep education blue (#1E40AF) - Trust, professionalism
- **Secondary**: Warm hope orange (#F59E0B) - Energy, inspiration
- **Success**: Verified green - Badges, completion states
- **Dark Mode**: Fully supported via Tailwind CSS

### Theme

- Large rounded corners (rounded-2xl)
- Soft shadows with subtle gradients
- Fluid animations with Framer Motion
- Mobile-first responsive design

## 🔑 Key Features

### Implemented

- ✅ Responsive landing page with hero, features, and CTAs
- ✅ Authentication (login/register) with role selection
- ✅ Student discovery with filters and search
- ✅ Detailed student profiles with tabs
- ✅ Progress tracking and budget breakdowns
- ✅ Dark/light mode toggle
- ✅ Protected routes with RBAC
- ✅ Mobile-optimized navigation

### Roadmap

- 🔄 Checkout flow
- 🔄 Donor dashboard
- 🔄 Student dashboard
- 🔄 Campaign creation wizard
- 🔄 Messaging system
- 🔄 Admin verification queue
- 🔄 MSW API mocking
- 🔄 Unit & E2E tests

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Radix primitives)
- **Forms**: React Hook Form + Zod validation
- **Data**: TanStack Query (React Query)
- **HTTP**: Axios
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run typecheck       # TypeScript check

# Testing (to be added)
npm run test            # Run unit tests
npm run e2e             # Run Playwright tests
```

## 🔐 Authentication

Current implementation uses a stub authentication system with localStorage persistence. Users can:

1. Register as either a **Student** or **Donor**
2. Login with email/password
3. Access role-specific routes

### Protected Routes

```tsx
<ProtectedRoute requiredRole="student">
  <StudentDashboard />
</ProtectedRoute>
```

## 🎨 Component Usage

### Student Card

```tsx
import { StudentCard } from '@/components/cards/StudentCard';

<StudentCard
  student={studentData}
  onDonate={() => navigate(`/checkout/${student.id}`)}
/>
```

### Themed Button

```tsx
import { Button } from '@/components/ui/button';

<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

## 🌐 Routes

| Path | Description | Auth |
|------|-------------|------|
| `/` | Landing page | Public |
| `/login` | Sign in | Public |
| `/register` | Sign up | Public |
| `/discover` | Browse students | Public |
| `/students/:id` | Student profile | Public |
| `/checkout/:id` | Donation checkout | Protected |
| `/donor` | Donor dashboard | Protected (Donor) |
| `/student` | Student dashboard | Protected (Student) |
| `/admin` | Admin panel | Protected (Admin) |

## 🧪 Testing (Planned)

### Unit Tests (Vitest)

```bash
npm run test
```

- Form validation
- Component rendering
- Utility functions

### E2E Tests (Playwright)

```bash
npm run e2e
```

- Donor registration → discovery → donation flow
- Student registration → campaign creation flow

## 🚀 Deployment

This project is optimized for deployment on:

- **Vercel** (recommended)
- **Netlify**
- **Cloudflare Pages**

### Build

```bash
npm run build
```

Output in `dist/` directory.

## 📦 Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5173/api
VITE_APP_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Radix UI for accessible primitives
- Lucide for the icon set

---

**Built with ❤️ for education transparency**
