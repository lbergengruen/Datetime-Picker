import { getRehearsalSlots } from '@/lib/actions';
import { SubmissionForm } from '@/components/SubmissionForm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const slots = await getRehearsalSlots();

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rehearsal Availability
          </h1>
          <p className="text-gray-600">
            Select all the rehearsal slots you can attend
          </p>
        </div>
        <SubmissionForm slots={slots} />
      </div>
    </main>
  );
}
