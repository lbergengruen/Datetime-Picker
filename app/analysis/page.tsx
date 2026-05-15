import { getAnalysisData } from '@/lib/actions';
import { AnalysisCard } from '@/components/AnalysisCard';
import { Badge } from '@/components/ui/Badge';

// Force dynamic rendering to avoid static generation issues during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalysisPage() {
  const { slots, totalSubmissions } = await getAnalysisData();

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Análisis de Ensayos
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">
              Mejores opciones de ensayo según la disponibilidad
            </p>
            <Badge>{totalSubmissions} {totalSubmissions === 1 ? 'respuesta' : 'respuestas'}</Badge>
          </div>
        </div>

        {slots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aún no hay horarios de ensayo disponibles.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {slots.map((analysisSlot, index) => (
              <AnalysisCard
                key={analysisSlot.slot.id}
                analysisSlot={analysisSlot}
                rank={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
