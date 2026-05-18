import { unstable_noStore } from 'next/cache';
import { getRehearsalSlots, getSubmissionsList } from '@/lib/actions';
import { CalendarSubmissionForm } from '@/components/CalendarSubmissionForm';
import type { RehearsalSlot } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function Home() {
  unstable_noStore();
  
  let slots: RehearsalSlot[] = [];
  let submissions: Awaited<ReturnType<typeof getSubmissionsList>> = [];
  
  try {
    [slots, submissions] = await Promise.all([
      getRehearsalSlots(),
      getSubmissionsList()
    ]);
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Disponibilidad para Ensayos
          </h1>
          <p className="text-gray-600">
            Selecciona los horarios en los que puedes asistir al ensayo
          </p>
        </div>
        <CalendarSubmissionForm slots={slots} submissions={submissions} />
      </div>
    </main>
  );
}
