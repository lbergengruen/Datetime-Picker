'use client';

import { useState, useMemo } from 'react';
import { Button } from './ui/Button';
import { formatDateInput } from '@/lib/utils';

interface MultiDatePickerProps {
  selectedDates: string[];
  onChange: (dates: string[]) => void;
}

export function MultiDatePicker({ selectedDates, onChange }: MultiDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calendar = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: Array<{ date: number; dateString: string; isCurrentMonth: boolean }> = [];

    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      days.push({
        date: prevMonthLastDay - i,
        dateString: formatDateInput(new Date(prevYear, prevMonth, prevMonthLastDay - i)),
        isCurrentMonth: false,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        dateString: formatDateInput(new Date(currentYear, currentMonth, i)),
        isCurrentMonth: true,
      });
    }

    // Next month padding
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({
        date: i,
        dateString: formatDateInput(new Date(nextYear, nextMonth, i)),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  const toggleDate = (dateString: string) => {
    if (selectedDates.includes(dateString)) {
      onChange(selectedDates.filter(d => d !== dateString));
    } else {
      onChange([...selectedDates, dateString].sort());
    }
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-semibold text-gray-900">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((day, index) => {
          const isSelected = selectedDates.includes(day.dateString);
          return (
            <button
              key={index}
              type="button"
              onClick={() => toggleDate(day.dateString)}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                ${day.isCurrentMonth 
                  ? 'text-gray-900 hover:bg-gray-100' 
                  : 'text-gray-400 hover:bg-gray-50'
                }
                ${isSelected 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 font-semibold' 
                  : ''
                }
              `}
            >
              {day.date}
            </button>
          );
        })}
      </div>

      {/* Selected dates summary */}
      {selectedDates.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDates.map(dateString => (
              <button
                key={dateString}
                type="button"
                onClick={() => toggleDate(dateString)}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md hover:bg-blue-200 transition-colors"
              >
                {new Date(dateString).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
                <span className="text-blue-600">×</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange([])}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
