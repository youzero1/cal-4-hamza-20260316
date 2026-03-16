'use client';

import { useState, useEffect, useCallback } from 'react';
import Calendar from '@/components/Calendar';
import EventModal from '@/components/EventModal';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  color: string;
  createdAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  color: string;
}

const PASTEL_COLORS = [
  '#ffb3ba',
  '#ffdfba',
  '#ffffba',
  '#baffc9',
  '#bae1ff',
  '#e8baff',
  '#ffd1dc',
  '#c9f2c7',
  '#aed9e0',
  '#f8c8d4',
];

export { PASTEL_COLORS };

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const res = await fetch(`/api/events?month=${month}&year=${year}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setSelectedDate(event.date);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingEvent(null);
    setSelectedDate('');
  };

  const handleSave = async (formData: EventFormData) => {
    try {
      if (editingEvent) {
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update event');
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create event');
      }
      await fetchEvents();
      handleModalClose();
    } catch (err) {
      console.error('Save error:', err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete event');
      await fetchEvents();
      handleModalClose();
    } catch (err) {
      console.error('Delete error:', err);
      throw err;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-indigo-700 tracking-tight">
            📅 My Calendar
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Click any day to add an event
          </p>
        </header>

        <Calendar
          currentDate={currentDate}
          events={events}
          loading={loading}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDayClick={handleDayClick}
          onEventClick={handleEventClick}
        />

        {modalOpen && (
          <EventModal
            isOpen={modalOpen}
            selectedDate={selectedDate}
            editingEvent={editingEvent}
            onClose={handleModalClose}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
}
