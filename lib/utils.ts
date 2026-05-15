import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Parse date string (YYYY-MM-DD) and return a Date object at noon UTC
// This avoids timezone issues where midnight UTC becomes previous day in negative timezones
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  // Create date at noon UTC to avoid day boundary issues
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatDateRange(date: Date, startTime: string, endTime: string): string {
  return `${formatDate(date)} — ${formatTime(startTime)}–${formatTime(endTime)}`;
}

// Format date for display in calendar cards (e.g., "16 de Junio")
export function formatDateCard(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// Get day name in Spanish (e.g., "Lunes")
export function getDayName(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
  }).format(date);
}

export function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
