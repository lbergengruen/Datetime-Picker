import { getRehearsalSlots } from '@/lib/actions';
import { SlotForm } from '@/components/SlotForm';
import { SlotList } from '@/components/SlotList';

export const dynamic = 'force-dynamic';

export default async function ConfigPage() {
  const slots = await getRehearsalSlots();

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configure Rehearsal Slots
          </h1>
          <p className="text-gray-600">
            Add and manage available rehearsal times
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <SlotForm />
          </div>
          <div>
            <SlotList slots={slots} />
          </div>
        </div>
      </div>
    </main>
  );
}
