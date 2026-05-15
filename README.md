# Rehearsal Availability Scheduler

A simple, clean web app for scheduling choir rehearsals.

## 🎉 Status: **Fully Implemented & Ready to Use!**

All features are complete and the app is ready for deployment.

## Overview

This app allows organizers to create rehearsal slots and participants to submit their availability. The app analyzes responses to show which slots work best for the most people.

## 🚀 Quick Start

**New to this project?** → See [`QUICK_START.md`](./QUICK_START.md) for a 5-minute setup guide.

**Ready to deploy?** → See [`SETUP.md`](./SETUP.md) for detailed instructions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Neon Postgres
- **ORM**: Prisma
- **Deployment**: Vercel

## Features

- ✅ No authentication required
- ✅ Mobile-friendly interface
- ✅ Create and manage rehearsal slots
- ✅ Submit availability by name
- ✅ Analyze best rehearsal options
- ✅ Clean, minimal UI

## ✅ What's Implemented

- ✅ **Submission Page** - Participants submit their availability
- ✅ **Config Page** - Organizers create and manage rehearsal slots
- ✅ **Analysis Page** - View attendance and find best slots
- ✅ **Mobile-First Design** - Works perfectly on phones
- ✅ **No Authentication** - Simple and frictionless
- ✅ **Real-Time Updates** - Changes reflect immediately
- ✅ **Clean UI** - Modern, minimal design

See [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) for complete details.

## Documentation

See the `/docs` folder for detailed design specifications and implementation tasks:

- [`docs/design.md`](./docs/design.md) - Design philosophy and UI/UX guidelines
- [`docs/specs.md`](./docs/specs.md) - Technical specifications and data models
- [`docs/tasks.md`](./docs/tasks.md) - Implementation roadmap and task breakdown

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm/npm/yarn
- Neon Postgres database

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL

# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Create a `.env` file with:

```
DATABASE_URL="postgresql://..."
```

## Project Structure

```
/app                 # Next.js App Router pages
/components          # React components
/lib                 # Utility functions and server actions
/prisma              # Database schema and migrations
/docs                # Design specs and documentation
/public              # Static assets
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Make sure to add your `DATABASE_URL` environment variable in Vercel.

## License

MIT
