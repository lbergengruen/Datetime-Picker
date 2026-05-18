'use client';

import { useState, useMemo } from 'react';
import { RehearsalSlot } from '@prisma/client';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { submitAvailability, getSubmissionByName, updateAvailability } from '@/lib/actions';
import { formatTime, calculateEndTime, formatDateInput } from '@/lib/utils';

interface CalendarSubmissionFormProps {
  slots: RehearsalSlot[];
}

// Helper to get date parts from a Date that might be interpreted as UTC
function getDateParts(date: Date): { day: number; month: number; year: number } {
  // Use UTC methods to avoid timezone issues
  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth(),
    year: date.getUTCFullYear(),
  };
}

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface DiaAgrupado {
  fecha: string;
  diaSemana: string;
  diaNumero: number;
  mes: string;
  slots: Array<{
    slot: RehearsalSlot;
    horaInicio: string;
    horaFin: string;
  }>;
}

export function CalendarSubmissionForm({ slots }: CalendarSubmissionFormProps) {
  const [nombre, setNombre] = useState('');
  const [slotsSeleccionados, setSlotsSeleccionados] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [buscando, setBuscando] = useState(false);

  const diasAgrupados = useMemo(() => {
    const grupos = new Map<string, DiaAgrupado>();

    slots.forEach(slot => {
      // Parse the date using UTC methods to avoid timezone issues
      const fecha = new Date(slot.date);
      const { day, month, year } = getDateParts(fecha);
      const fechaKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Create a date object for getting the day of week (using noon UTC to avoid boundary issues)
      const fechaParaDiaSemana = new Date(Date.UTC(year, month, day, 12, 0, 0));
      
      if (!grupos.has(fechaKey)) {
        grupos.set(fechaKey, {
          fecha: fechaKey,
          diaSemana: diasSemana[fechaParaDiaSemana.getUTCDay()],
          diaNumero: day,
          mes: meses[month],
          slots: [],
        });
      }

      const grupo = grupos.get(fechaKey)!;
      const horaFin = calculateEndTime(slot.startTime, slot.durationMinutes);
      
      grupo.slots.push({
        slot,
        horaInicio: formatTime(slot.startTime),
        horaFin: formatTime(horaFin),
      });
    });

    // Ordenar slots dentro de cada día por hora
    grupos.forEach(grupo => {
      grupo.slots.sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime));
    });

    // Convertir a array y ordenar por fecha
    return Array.from(grupos.values()).sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }, [slots]);

  const toggleSlot = (slotId: string) => {
    const nuevos = new Set(slotsSeleccionados);
    if (nuevos.has(slotId)) {
      nuevos.delete(slotId);
    } else {
      nuevos.add(slotId);
    }
    setSlotsSeleccionados(nuevos);
  };

  const buscarRespuesta = async () => {
    if (!nombre.trim()) {
      setError('Ingresa tu nombre para buscar tu respuesta');
      return;
    }

    setBuscando(true);
    setError('');

    try {
      const resultado = await getSubmissionByName(nombre);
      
      if (resultado.success && resultado.data) {
        // Encontró una respuesta existente
        setSubmissionId(resultado.data.id);
        setModoEdicion(true);
        // Cargar las selecciones existentes
        const slotIds = resultado.data.selections.map(s => s.slotId);
        setSlotsSeleccionados(new Set(slotIds));
      } else {
        setError('No se encontró una respuesta con ese nombre. Puedes crear una nueva.');
        setModoEdicion(false);
        setSubmissionId(null);
        setSlotsSeleccionados(new Set());
      }
    } catch (err) {
      setError('Error al buscar la respuesta');
    } finally {
      setBuscando(false);
    }
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      let resultado;
      
      if (modoEdicion && submissionId) {
        // Actualizar respuesta existente
        resultado = await updateAvailability({
          submissionId,
          slotIds: Array.from(slotsSeleccionados),
        });
      } else {
        // Crear nueva respuesta
        resultado = await submitAvailability({
          participantName: nombre,
          slotIds: Array.from(slotsSeleccionados),
        });
      }

      if (resultado.success) {
        setExito(true);
        setNombre('');
        setSlotsSeleccionados(new Set());
        setModoEdicion(false);
        setSubmissionId(null);
      } else {
        setError(resultado.error);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setCargando(false);
    }
  };

  if (exito) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {modoEdicion ? '¡Actualizado!' : '¡Gracias!'}
          </h2>
          <p className="text-gray-600">
            {modoEdicion 
              ? 'Tu disponibilidad ha sido actualizada correctamente.' 
              : 'Tu disponibilidad ha sido registrada.'}
          </p>
        </div>
        <Button onClick={() => setExito(false)}>
          Enviar otra respuesta
        </Button>
      </div>
    );
  }

  if (diasAgrupados.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-600">Aún no hay horarios de ensayo disponibles.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <form onSubmit={enviar} className="space-y-8">
        <div className="space-y-2">
          <Input
            type="text"
            label="Tu Nombre"
            placeholder="Ingresa tu nombre"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              // Reset edit mode when name changes
              if (modoEdicion) {
                setModoEdicion(false);
                setSubmissionId(null);
                setSlotsSeleccionados(new Set());
              }
            }}
            required
            autoFocus
            maxLength={100}
          />
          
          {/* Botón para buscar/editar respuesta existente */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={buscarRespuesta}
              disabled={buscando || !nombre.trim()}
              className="text-sm"
            >
              {buscando ? 'Buscando...' : modoEdicion ? '💾 Modo Edición' : '🔍 Buscar mi respuesta'}
            </Button>
            
            {modoEdicion && (
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  setModoEdicion(false);
                  setSubmissionId(null);
                  setSlotsSeleccionados(new Set());
                }}
                className="text-sm"
              >
                Cancelar edición
              </Button>
            )}
          </div>
          
          {modoEdicion && (
            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              Estás editando tu respuesta existente. Modifica las selecciones y guarda los cambios.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Selecciona los horarios en los que puedes ensayar:
          </label>
          
          {/* Vista de Calendario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {diasAgrupados.map((dia) => (
              <div 
                key={dia.fecha} 
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Header del día */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3">
                  <div className="text-xs uppercase tracking-wide opacity-90">
                    {dia.diaSemana}
                  </div>
                  <div className="text-lg font-bold">
                    {dia.diaNumero} de {dia.mes}
                  </div>
                </div>

                {/* Slots del día */}
                <div className="p-4 space-y-2">
                  {dia.slots.map(({ slot, horaInicio, horaFin }) => {
                    const seleccionado = slotsSeleccionados.has(slot.id);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => toggleSlot(slot.id)}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left
                          ${seleccionado 
                            ? 'border-blue-500 bg-blue-50 text-blue-900' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                          ${seleccionado 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300'
                          }
                        `}>
                          {seleccionado && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {horaInicio} – {horaFin}
                          </div>
                          <div className="text-xs text-gray-500">
                            {slot.durationMinutes} minutos
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Días vacíos (futura mejora) */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          {slotsSeleccionados.size > 0 ? (
            <span>
              {slotsSeleccionados.size} horario{slotsSeleccionados.size !== 1 ? 's' : ''} seleccionado{slotsSeleccionados.size !== 1 ? 's' : ''}
            </span>
          ) : (
            <span>Selecciona al menos un horario</span>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={cargando || !nombre.trim() || slotsSeleccionados.size === 0}
          className="w-full"
        >
          {cargando 
            ? (modoEdicion ? 'Guardando...' : 'Enviando...') 
            : (modoEdicion ? '💾 Guardar Cambios' : 'Enviar Disponibilidad')
          }
        </Button>
      </form>
    </div>
  );
}
