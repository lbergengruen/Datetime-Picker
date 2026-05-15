import { unstable_noStore } from 'next/cache';
import { getAnalysisData, getSubmissionsList } from '@/lib/actions';
import { AttendanceChart } from '@/components/AttendanceChart';
import { StatsSummary } from '@/components/StatsSummary';
import { DetailedSlotList } from '@/components/DetailedSlotList';
import { SubmissionsManager } from '@/components/SubmissionsManager';
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
  let submissions: Awaited<ReturnType<typeof getSubmissionsList>> = [];
  
  try {
    const data = await getAnalysisData();
    slots = data.slots;
    totalSubmissions = data.totalSubmissions;
    submissions = await getSubmissionsList();
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

            {/* Three Column Layout on large screens */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Chart */}
              <div className="lg:col-span-1">
                <AttendanceChart 
                  slots={slots} 
                  totalSubmissions={totalSubmissions} 
                />
              </div>

              {/* Middle: Detailed List */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Ranking de Horarios
                </h3>
                <DetailedSlotList 
                  slots={slots} 
                  totalSubmissions={totalSubmissions} 
                />
              </div>

              {/* Right: Submissions Manager */}
              <div className="lg:col-span-1">
                <SubmissionsManager submissions={submissions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
