# CollabNet

A peer-to-peer matchmaking platform connecting developers with researchers for cross-disciplinary collaboration.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Security](#security)
- [Development Roadmap](#development-roadmap)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

CollabNet addresses the collaboration gap in academic research by providing a platform where developers seeking real-world projects can connect with researchers requiring technical expertise. Designed for the University of Southern Mississippi community, the platform utilizes AI-powered semantic matching to recommend collaborators based on skills, interests, and project requirements rather than simple keyword searches.

## Features

### Current Features

- **Institutional Authentication** - Secure authentication with @usm.edu email verification
- **Profile Management** - Role-based user profiles (Developer/Researcher/Hobbyist)
- **Skills Management** - Dynamic tag input system with autocomplete functionality
- **GitHub Integration** - Real-time username validation via GitHub API
- **Avatar Management** - Image upload and storage via Supabase Storage
- **Responsive Design** - Modern UI built with Tailwind CSS and shadcn/ui components

### Planned Features

- **AI-Powered Matching** - Semantic search using pgvector and OpenAI embeddings
- **Project Marketplace** - Platform for browsing and applying to research projects
- **Real-time Notifications** - Updates on project applications and matches
- **Collaboration Tools** - Integrated messaging and project management

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 (App Router) | Server Components, SEO optimization, type-safe routing |
| **Language** | TypeScript | Type safety across full stack |
| **Styling** | Tailwind CSS + shadcn/ui | Modern, accessible UI components |
| **Backend** | Next.js Server Actions | Simplified API with built-in security |
| **Database** | Supabase (PostgreSQL) | Relational database with Row Level Security |
| **Storage** | Supabase Storage | Avatar uploads with automatic optimization |
| **Validation** | Zod + React Hook Form | Type-safe form validation on client and server |
| **AI Layer** | OpenAI API + pgvector | Vector embeddings for semantic matching (planned) |
| **Deployment** | Vercel | Edge-optimized hosting with automatic preview deploys |

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pramishpy/collabnet.git
   cd collabnet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Set up the database**
   
   Navigate to your Supabase Dashboard → SQL Editor and execute the migration file:
   ```bash
   supabase/migrations/20260125000000_initial_schema.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
collabnet/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected routes
│   │   └── profile/
│   │       ├── create/      # Profile creation flow
│   │       └── page.tsx     # Profile display
│   ├── auth/
│   │   ├── callback/        # Auth callback handler
│   │   └── signout/         # Logout route
│   └── layout.tsx           # Root layout with header
│
├── components/
│   ├── profile/             # Profile-specific components
│   │   ├── avatar-upload.tsx
│   │   ├── github-verify.tsx
│   │   └── tag-input.tsx
│   ├── shared/              # Reusable components
│   │   └── header.tsx
│   └── ui/                  # shadcn/ui components
│
├── lib/
│   ├── supabase/            # Supabase client utilities
│   │   ├── client.ts        # Browser client
│   │   └── server.ts        # Server client
│   ├── validations/         # Zod schemas
│   │   └── profile.ts
│   └── utils.ts             # Helper functions
│
└── supabase/
    └── migrations/          # Database migrations
```

## Database Schema

### Tables

#### profiles
```sql
- id: UUID (references auth.users)
- email: TEXT
- full_name: TEXT
- bio: TEXT
- skills: TEXT[]
- research_interests: TEXT
- role: ENUM('developer', 'researcher', 'hobbyist')
- github_username: TEXT
- avatar_url: TEXT
- embedding: VECTOR(1536)  # For AI matching
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

#### projects (Planned)
```sql
- id: UUID
- creator_id: UUID (references profiles)
- title: TEXT
- description: TEXT
- required_skills: TEXT[]
- status: ENUM('recruiting', 'ongoing', 'completed')
- embedding: VECTOR(1536)
```

#### applications (Planned)
```sql
- id: UUID
- user_id: UUID (references profiles)
- project_id: UUID (references projects)
- status: ENUM('pending', 'accepted', 'rejected')
- match_score: FLOAT
```

## Security

All database tables implement Row Level Security (RLS) policies:

- Users can only edit their own profiles
- Project creators control access to applications
- Public read access for discovery features
- Secure storage policies for avatar uploads

### Key Security Features

**Institutional Email Verification**
```typescript
if (!email.endsWith('@usm.edu')) {
  return { error: 'Please use your @usm.edu email address' }
}
```

**GitHub Username Validation**
```typescript
const response = await fetch(`https://api.github.com/users/${username}`)
// Returns validation status with visual feedback
```

**Avatar Upload Security**
- Maximum file size: 2MB
- Automatic overwrite on re-upload
- RLS policies ensure users can only modify their own avatars

## Development Roadmap

### Phase 1: Foundation & Authentication (Completed)
- [x] Next.js 16 + TypeScript setup
- [x] Supabase authentication with email verification
- [x] Profile creation form with validation
- [x] GitHub username verification
- [x] Avatar upload system
- [x] Profile display page

### Phase 2: Project Marketplace (In Progress)
- [ ] Post project form
- [ ] Browse projects feed
- [ ] Apply to projects functionality
- [ ] Project detail pages

### Phase 3: AI Matching
- [ ] OpenAI embeddings integration
- [ ] pgvector semantic search
- [ ] "Recommended for You" algorithm
- [ ] Match score calculation

### Phase 4: Production Release
- [ ] Real-time notifications
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Production deployment

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Navigate to [vercel.com/new](https://vercel.com/new)
   - Select your repository
   - Add environment variables from `.env.local`
   - Deploy

3. **Update Supabase redirect URLs**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel domain to "Redirect URLs"

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your app URL (for auth redirects) | Yes |
| `OPENAI_API_KEY` | OpenAI API key (for AI matching) | No (Phase 3) |

## Testing

### Local Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Test User Flow

1. Sign up with test@usm.edu
2. Verify email (can be disabled in Supabase for faster testing)
3. Create profile with skills: python, react, machine-learning
4. Upload avatar
5. View completed profile

## Troubleshooting

### Common Issues

**Email confirmation link expires**
- Solution: Navigate to Supabase → Authentication → Providers → Email, and disable "Confirm email" during development

**"Could not find table 'profiles'"**
- Solution: Execute the SQL migration in Supabase Dashboard → SQL Editor

**Avatar upload fails**
- Solution: Verify Storage RLS policies and ensure avatars bucket is public

## Contributing

This project is currently in active development. Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zod Validation](https://zod.dev)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Pramish Pandey**  
Computer Science Student  
University of Southern Mississippi

- GitHub: [@pramishpy](https://github.com/pramishpy)
- Repository: [collabnet](https://github.com/pramishpy/collabnet)

## Acknowledgments

- Built as part of internship preparation portfolio
- Inspired by collaboration challenges in the USM research community
- Utilizes modern web development best practices and technologies

---

Last Updated: January 27, 2026
