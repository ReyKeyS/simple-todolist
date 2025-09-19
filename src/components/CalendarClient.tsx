'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { id } from 'date-fns/locale';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AddTodoDialog } from '@/components/AddTodoDialog'
import { EditTodoDialog } from '@/components/EditTodoDialog';
import { Priority } from '@prisma/client';

const locales = { 'id-ID': id };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface Event {
  id?: number;
  title?: string | null;
  description?: string | null;
  start?: Date;
  end?: Date;
  complete?: boolean;
  priority?: Priority;
}
interface CalendarClientProps {
  events: Event[];
}

export default function CalendarClient({ events }: CalendarClientProps) {
  const router = useRouter();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
    setSelectedDate(slotInfo.start);
    setIsAddModalOpen(true);

    const eventOnDate = events.find(e => e.start?.toDateString() === slotInfo.start.toDateString());
    if (eventOnDate) {
      setSelectedEvent(eventOnDate);
    } else {
      setSelectedEvent(null);
    }
  }, [events]);

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setSelectedDate(event.start || null);
    setIsEditModalOpen(true);
  };

  const refreshData = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    router.refresh();
  };

  const eventPropGetter = (event: Event) => {
    const style: React.CSSProperties = {};
    const priority = event?.priority;
    const complete = event?.complete;

    if (complete) {
      style.backgroundColor = '#22c55e';
      style.borderColor = '#15803d';
      style.opacity = 0.7;
      style.textDecoration = 'line-through';
    } else {
      if (priority === 'HIGH') {
        style.backgroundColor = '#ef4444';
      } else if (priority === 'MEDIUM') {
        style.backgroundColor = '#f97316';
      } else if (priority === 'LOW') {
        style.backgroundColor = '#eab308';
      }
    }
    return { style };
  };

  const { formats } = useMemo(() => ({
    formats: {
      eventTimeRangeFormat: () => '',
    }
  }), []);

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 750 }}
        className="bg-white p-4 rounded-lg shadow"
        views={['month', 'week', 'agenda']}
        formats={formats}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        popup={true}
      />
      <AddTodoDialog
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        selectedDate={selectedDate}
        onTodoAdded={refreshData}
      />
      {selectedEvent && (
        <EditTodoDialog
          event={selectedEvent}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onTodoUpdated={refreshData}
        />
      )}
    </div>
  );
}