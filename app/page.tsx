import { getRehearsalSlots } from '@/lib/actions';
import { CalendarSubmissionForm } from '@/components/CalendarSubmissionForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const slots = await getRehearsalSlots();

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Disponibilidad para Ensayos
          </h1>
          <p className="text-gray-600">
            Selecciona los horarios en los que puedes asistir al ensayo
          </p>
        </div>
        <CalendarSubmissionForm slots={slots} />
      </div>
    </main>
  );
}
