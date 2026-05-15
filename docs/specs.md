---
title: Technical Specifications
version: 1.0
status: draft
---

# Technical Specifications

## System Architecture

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 14.2+ |
| Language | TypeScript | 5.4+ |
| Styling | TailwindCSS | 3.4+ |
| Database | Neon Postgres | Latest |
| ORM | Prisma | 5.12+ |
| Deployment | Vercel | Latest |
| Runtime | Node.js | 18+ |

### Architecture Pattern

- **Server-Side Rendering (SSR)** for initial page loads
- **Server Actions** for data mutations
- **Server Components** by default
- **Client Components** only when necessary (forms, interactive elements)

## Data Model

### Database Schema

```prisma
model RehearsalSlot {
  id              String   @id @default(cuid())
  date            DateTime
  startTime       String
  durationMinutes Int
  createdAt       DateTime @default(now())

  selections AvailabilitySelection[]
}

model AvailabilitySubmission {
  id              String   @id @default(cuid())
  participantName String
  createdAt       DateTime @default(now())

  selections AvailabilitySelection[]
}

model AvailabilitySelection {
  id           String @id @default(cuid())
  submissionId String
  slotId       String

  submission AvailabilitySubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  slot       RehearsalSlot          @relation(fields: [slotId], references: [id], onDelete: Cascade)

  @@unique([submissionId, slotId])
}
```

### Data Types & Constraints

**RehearsalSlot:**
- `id`: CUID (Collision-resistant Unique ID)
- `date`: ISO 8601 date (YYYY-MM-DD)
- `startTime`: String in HH:MM format (24-hour)
- `durationMinutes`: Positive integer (15-480 range recommended)
- `createdAt`: Timestamp with timezone

**AvailabilitySubmission:**
- `id`: CUID
- `participantName`: String, 1-100 characters, trimmed
- `createdAt`: Timestamp with timezone

**AvailabilitySelection:**
- `id`: CUID
- `submissionId`: Foreign key to AvailabilitySubmission
- `slotId`: Foreign key to RehearsalSlot
- Unique constraint on (submissionId, slotId) pair

### Computed Fields

**endTime** (RehearsalSlot):
```typescript
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}
```

## API Design

### Server Actions

**Location:** `/lib/actions.ts`

#### Slot Management

```typescript
// Create new rehearsal slot
async function createRehearsalSlot(data: {
  date: Date;
  startTime: string;
  durationMinutes: number;
}): Promise<RehearsalSlot>

// Delete rehearsal slot
async function deleteRehearsalSlot(id: string): Promise<void>

// Get all rehearsal slots (sorted by date)
async function getRehearsalSlots(): Promise<RehearsalSlot[]>

// Delete all rehearsal slots
async function deleteAllRehearsalSlots(): Promise<void>
```

#### Availability Submission

```typescript
// Submit availability
async function submitAvailability(data: {
  participantName: string;
  slotIds: string[];
}): Promise<AvailabilitySubmission>

// Get all submissions
async function getSubmissions(): Promise<AvailabilitySubmission[]>
```

#### Analysis

```typescript
// Get analysis data
async function getAnalysisData(): Promise<{
  slots: Array<{
    slot: RehearsalSlot;
    attendeeCount: number;
    attendees: string[];
    attendanceRate: number;
  }>;
  totalSubmissions: number;
}>
```

### Error Handling

All server actions return:
```typescript
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }
```

## Page Specifications

### 1. Submission Page (`/`)

**Route:** `/app/page.tsx`

**Data Fetching:**
```typescript
// Server Component
async function SubmissionPage() {
  const slots = await getRehearsalSlots();
  return <SubmissionForm slots={slots} />;
}
```

**Client Component:** `SubmissionForm`
- Form state management
- Checkbox selection
- Form submission with Server Action
- Success/error state handling

**Validation:**
- Participant name: Required, 1-100 chars
- At least one slot must be selected

**User Flow:**
1. Page loads with slots
2. User enters name
3. User selects available slots
4. User clicks submit
5. Success message displayed
6. Option to submit another response

### 2. Config Page (`/config`)

**Route:** `/app/config/page.tsx`

**Data Fetching:**
```typescript
async function ConfigPage() {
  const slots = await getRehearsalSlots();
  return <ConfigView slots={slots} />;
}
```

**Client Components:**
- `AddSlotForm`: Form for creating slots
- `SlotList`: List with delete actions

**Validation:**
- Date: Required, must be valid date
- Start time: Required, HH:MM format
- Duration: Required, 15-480 minutes

**User Flow:**
1. Fill in slot details
2. Click "Add Slot"
3. Slot appears in list
4. Delete slots as needed

### 3. Analysis Page (`/analysis`)

**Route:** `/app/analysis/page.tsx`

**Data Fetching:**
```typescript
async function AnalysisPage() {
  const analysis = await getAnalysisData();
  return <AnalysisView data={analysis} />;
}
```

**Server Component:** Fully server-rendered

**Sorting Logic:**
1. Primary: Attendee count (descending)
2. Secondary: Date (ascending)

**Display:**
- Top 3 slots highlighted
- Trophy icon for #1
- Expandable attendee lists
- Percentage attendance rate

## Database Operations

### Prisma Client Usage

**Singleton Pattern:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Query Optimization

**Include Relations:**
```typescript
// Get slots with selections
await prisma.rehearsalSlot.findMany({
  include: {
    selections: {
      include: {
        submission: true
      }
    }
  },
  orderBy: {
    date: 'asc'
  }
});
```

**Cascade Deletes:**
- Deleting a slot removes all associated selections
- Deleting a submission removes all associated selections

## Environment Configuration

### Required Variables

```bash
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### Vercel Deployment

**Environment Variables:**
- `DATABASE_URL`: Set in Vercel dashboard
- Automatically provided: `VERCEL_URL`, `VERCEL_ENV`

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Performance Requirements

### Metrics

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |
| Mobile Performance | > 85 |

### Optimization Strategies

1. **Server-Side Rendering**: Initial HTML fully rendered
2. **Static Assets**: Cached with long TTL
3. **Database Queries**: Indexed on date and createdAt
4. **Image Optimization**: Next.js Image component (if images used)
5. **Code Splitting**: Automatic with Next.js App Router

## Security Considerations

### Input Validation

- Sanitize all user inputs
- Validate data types and ranges
- Prevent SQL injection (Prisma handles this)
- XSS protection (React handles this)

### Database Security

- Connection over SSL
- Environment variables for credentials
- No sensitive data stored
- Cascade deletes to prevent orphaned records

### Rate Limiting (Optional)

Consider implementing for production:
- Max 10 submissions per IP per hour
- Max 50 slot creations per hour

## Testing Strategy

### Unit Tests (Optional)

- Server action validation logic
- Date/time calculation functions
- Data transformation utilities

### Integration Tests (Optional)

- Database operations
- Form submissions
- Data retrieval

### Manual Testing Checklist

- [ ] Create rehearsal slot
- [ ] Delete rehearsal slot
- [ ] Submit availability
- [ ] View analysis
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Error handling

## Monitoring & Logging

### Vercel Analytics

- Enable Web Analytics
- Track page views
- Monitor performance metrics

### Error Tracking (Optional)

- Sentry integration
- Log server action failures
- Track database errors

## Future Enhancements

### Phase 2 (Optional)

- Dark mode toggle
- CSV export of analysis
- Copy shareable link
- Duplicate slot functionality
- "Select all" helper buttons

### Phase 3 (Optional)

- Edit submission via localStorage
- Email notifications
- Calendar integration (.ics export)
- Multi-language support

---

**Dependencies:**

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prisma/client": "^5.12.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.12.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "prisma": "^5.12.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

---

**Next Steps:**
Review and approve specifications before implementation begins.
