import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type AppointmentCalendarOnConfirm = (payload: {
  dateISO: string;
  time24: string;
  endTime24: string;
}) => void;

type BusySlot = { inicio: string; fin: string };

export default function AppointmentCalendar({
  initialDate,
  durationMin = 30,
  onConfirm,
  onClose,
  profesionalId,
  loadBusy,
  workingHours = { start: '09:00', end: '18:00' },
  fetchWorkingHours,
  onDateChange,
  isSlotDisabled,
}: {
  initialDate?: Date;
  durationMin?: number;
  onConfirm: AppointmentCalendarOnConfirm;
  onClose: () => void;
  profesionalId?: number;
  loadBusy?: (args: { profesionalId: number; dateISO: string }) => Promise<BusySlot[]>;
  workingHours?: { start: string; end: string };
  fetchWorkingHours?: (profesionalId: number) => Promise<{ start: string; end: string }>;
  onDateChange?: (dateISO: string) => void;
  isSlotDisabled?: (dateISO: string, start24: string, end24: string) => boolean;
}) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate ?? new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [busy, setBusy] = useState<BusySlot[]>([]);
  const [loadingBusy, setLoadingBusy] = useState(false);
  const [wh, setWh] = useState<{ start: string; end: string }>(workingHours);

  useEffect(() => {
    let cancelled = false;
    const go = async () => {
      if (fetchWorkingHours && profesionalId) {
        try {
          const srv = await fetchWorkingHours(profesionalId);
          if (!cancelled) setWh({ start: srv.start, end: srv.end });
        } catch (e) {
          console.error('fetchWorkingHours falló, uso fallback', e);
          if (!cancelled) setWh(workingHours);
        }
      } else {
        setWh(workingHours);
      }
    };
    go();
    return () => { cancelled = true; };
  }, [fetchWorkingHours, profesionalId, workingHours.start, workingHours.end]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const to12h = (time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${pad(m)} ${ampm}`;
  };

  const addMinutes = (time24: string, minutes: number) => {
    const [h, m] = time24.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const hh = Math.floor(((total % (24 * 60)) + 24 * 60) % (24 * 60) / 60);
    const mm = ((total % (24 * 60)) + 24 * 60) % (24 * 60) % 60;
    return `${pad(hh)}:${pad(mm)}`;
  };

  const toMin = (time24: string) => {
    const [h, m] = time24.split(':').map(Number);
    return h * 60 + m;
  };

  const isOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
    toMin(aStart) < toMin(bEnd) && toMin(aEnd) > toMin(bStart);

  const allSlots24 = useMemo(() => {
    const slots: string[] = [];
    let t = wh.start;
    while (t < wh.end) {
      slots.push(t);
      t = addMinutes(t, durationMin);
    }
    return slots;
  }, [wh.start, wh.end, durationMin]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const nd = new Date(prev);
      nd.setMonth(prev.getMonth() + direction);
      return nd;
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setBusy([]);
  };

  const selectDate = (day: number | null) => {
    if (!day) return;
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setSelectedTime(null);
    if (onDateChange) {
      const dateISO = selected.toISOString().slice(0, 10);
      onDateChange(dateISO);
    }
  };

  const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const dayNames = ['Do','Lu','Ma','Mi','Ju','Vi','Sa'];

  const isToday = (day: number | null) => {
    const today = new Date();
    return !!day &&
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const isPastDate = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    const dateISO = selectedDate.toISOString().slice(0, 10);
    const time24 = selectedTime;
    const endTime24 = addMinutes(time24, durationMin);
    onConfirm({ dateISO, time24, endTime24 });
  };

  useEffect(() => {
    const run = async () => {
      if (!loadBusy || !profesionalId || !selectedDate) {
        setBusy([]);
        return;
      }
      const dateISO = selectedDate.toISOString().slice(0, 10);
      try {
        setLoadingBusy(true);
        const items = await loadBusy({ profesionalId, dateISO });
        setBusy(items || []);
      } catch (error) {
        console.error('Error cargando horarios ocupados:', error);
        setBusy([]);
      } finally {
        setLoadingBusy(false);
      }
    };
    run();
  }, [loadBusy, profesionalId, selectedDate]);

  const availableSlots24 = useMemo(() => {
    if (!selectedDate) return allSlots24;
    const dateISO = selectedDate.toISOString().slice(0, 10);
    return allSlots24.filter((s) => {
      const end = addMinutes(s, durationMin);
      if (busy.length > 0) {
        const overlapped = busy.some(b => isOverlap(s, end, b.inicio, b.fin));
        if (overlapped) return false;
      }
      if (isSlotDisabled && isSlotDisabled(dateISO, s, end)) {
        return false;
      }
      return true;
    });
  }, [allSlots24, busy, durationMin, selectedDate, isSlotDisabled]);

  return (
    <div className="bg-white text-gray-900 md:rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Selecciona fecha y hora</h1>
          <p className="text-gray-600 text-sm mt-1">Elige un día y un horario disponible</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Calendario */}
        <div className="w-full md:w-96 p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/30">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigateMonth(-1)} 
              className="p-2 hover:bg-white rounded-lg border border-gray-100 transition-all hover:shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold capitalize text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              onClick={() => navigateMonth(1)} 
              className="p-2 hover:bg-white rounded-lg border border-gray-100 transition-all hover:shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((d) => (
              <div key={d} className="p-2 text-center text-gray-500 font-semibold text-xs uppercase">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((day, i) => (
              <button
                key={i}
                onClick={() => selectDate(day)}
                disabled={isPastDate(day)}
                className={[
                  'h-11 w-11 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center',
                  !day ? 'invisible' : '',
                  isPastDate(day)
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'hover:bg-white cursor-pointer text-gray-700 hover:shadow-sm',
                  isToday(day)
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : '',
                  selectedDate && day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth()
                    ? 'bg-gradient-to-br from-green-600 to-green-500 text-white shadow-lg scale-105'
                    : ''
                ].join(' ')}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Horarios */}
        <div className="flex-1 p-8">
          {selectedDate ? (
            <div className="h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">Horarios disponibles</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${loadingBusy ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                  <p className="text-gray-600 text-sm">
                    {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {loadingBusy && ' (cargando…)'}
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-1">Horario: {wh.start} - {wh.end}</p>
              </div>

              <div className="flex-1 space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {availableSlots24.length === 0 && (
                  <div className="text-gray-400 text-sm p-4 bg-gray-50 rounded-lg text-center">
                    No hay horarios disponibles para esta fecha
                  </div>
                )}
                {availableSlots24.map((t24) => {
                  const label = to12h(t24);
                  const isSelected = selectedTime === t24;
                  return (
                    <button
                      key={t24}
                      onClick={() => setSelectedTime(t24)}
                      className={[
                        'w-full p-3 text-left rounded-lg border transition-all duration-200 flex items-center justify-between',
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-gray-100 hover:border-green-300 hover:bg-green-50/50'
                      ].join(' ')}
                    >
                      <span className={`font-semibold ${isSelected ? 'text-green-700' : 'text-gray-700'}`}>
                        {label}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-green-600 font-medium">✓ Seleccionado</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleConfirm}
                  disabled={!selectedTime}
                  className={[
                    'px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200',
                    selectedTime 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg hover:shadow-xl hover:scale-105' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  ].join(' ')}
                >
                  {selectedTime ? 'Confirmar Cita' : 'Selecciona un horario'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Selecciona una fecha del calendario</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #16a34a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #15803d;
        }
      `}</style>
    </div>
  );
}