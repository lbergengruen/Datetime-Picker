import { unstable_noStore } from 'next/cache';
import { getAnalysisData } from '@/lib/actions';
import { AttendanceChart } from '@/components/AttendanceChart';
import { StatsSummary } from '@/components/StatsSummary';
import { DetailedSlotList } from '@/components/DetailedSlotList';
import type { AnalysisSlot } from '@/lib/types';

// Force dynamic rendering to avoid static generation issues during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export default async function AnalysisPage() {
  // Prevent static caching
  unstable_noStore();
  
  let slots: AnalysisSlot[] = [];
  let totalSubmissions = 0;
  
  try {
    const data = await getAnalysisData();
    slots = data.slots;
    totalSubmissions = data.totalSubmissions;
  } catch (error) {
    console.error('Error loading analysis data:', error);
    // Return empty state if database is not available
  }

  // Calculate stats
  const bestAttendance = slots.length > 0 ? Math.max(...slots.map(s => s.attendeeCount)) : 0;
  const averageAttendance = slots.length > 0 
    ? slots.reduce((acc, s) => acc + s.attendeeCount, 0) / slots.length 
    : 0;

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Análisis de Ensayos
          </h1>
          <p className="text-gray-600">
            Visualización de la disponibilidad del coro para los horarios propuestos
          </p>
        </div>

        {slots.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-600">Aún no hay horarios de ensayo disponibles.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Summary */}
            <StatsSummary 
              totalSubmissions={totalSubmissions}
              totalSlots={slots.length}
              bestAttendance={bestAttendance}
              averageAttendance={averageAttendance}
            />

            {/* Two Column Layout: Chart + List */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Chart */}
              <div>
                <AttendanceChart 
                  slots={slots} 
                  totalSubmissions={totalSubmissions} 
                />
              </div>

              {/* Right: Detailed List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ranking de Horarios
                </h3>
                <DetailedSlotList 
                  slots={slots} 
                  totalSubmissions={totalSubmissions} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
