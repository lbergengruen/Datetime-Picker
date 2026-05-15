import { unstable_noStore } from 'next/cache';
import { getRehearsalSlots } from '@/lib/actions';
import { SlotForm } from '@/components/SlotForm';
import { SlotList } from '@/components/SlotList';
import type { RehearsalSlot } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ConfigPage() {
  unstable_noStore();
  
  let slots: RehearsalSlot[] = [];
  
  try {
    slots = await getRehearsalSlots();
  } catch (error) {
    console.error('Error loading slots:', error);
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurar Horarios de Ensayo
          </h1>
          <p className="text-gray-600">
            Agrega y gestiona los horarios disponibles para ensayar
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
