'use client';

import { CalendarEvent } from '@/app/page';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface CalendarProps {
  currentDate: Date;
  events: CalendarEvent[];
  loading: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDayClick: (dateStr: string) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function Calendar({
  currentDate,
  events,
  loading,
  onPrevMonth,
  onNextMonth,
  onDayClick,
  onEventClick,
}: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  // Build events map keyed by date string
  const eventsMap: Record<string, CalendarEvent[]> = {};
  events.forEach((ev) => {
    if (!eventsMap[ev.date]) eventsMap[ev.date] = [];
    eventsMap[ev.date].push(ev);
  });

  // Build calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-indigo-600">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-full text-white hover:bg-indigo-500 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            {MONTH_NAMES[month]} {year}
          </h2>
          {loading && (
            <span className="text-indigo-200 text-xs">Loading...</span>
          )}
        </div>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-full text-white hover:bg-indigo-500 transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 bg-indigo-50">
        {DAY_NAMES.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-indigo-400 py-2 uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-l border-t border-gray-200">
        {cells.map((day, idx) => {
          if (day === null) {
            return (
              <div
                key={`empty-${idx}`}
                className="calendar-day bg-gray-50 opacity-50"
              />
            );
          }

          const dateStr = toDateStr(year, month, day);
          const dayEvents = eventsMap[dateStr] || [];
          const isToday = dateStr === todayStr;

          return (
            <div
              key={dateStr}
              className="calendar-day hover:bg-indigo-50 cursor-pointer transition-colors"
              onClick={() => onDayClick(dateStr)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-indigo-100'
                  }`}
                >
                  {day}
                </span>
                {dayEvents.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{dayEvents.length - 3}
                  </span>
                )}
              </div>
              <div className="space-y-0.5 overflow-hidden">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev.id}
                    className="event-pill text-gray-800"
                    style={{ backgroundColor: ev.color }}
                    onClick={(e) => onEventClick(ev, e)}
                    title={ev.title}
                  >
                    {ev.time && (
                      <span className="mr-1 opacity-70">{ev.time}</span>
                    )}
                    {ev.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
