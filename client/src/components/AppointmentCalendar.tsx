// components/AppointmentCalendar.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type AppointmentCalendarOnConfirm = (payload: {
  dateISO: string;   // "YYYY-MM-DD"
  time24: string;    // "HH:mm"
  endTime24: string; // "HH:mm"
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
  onDateChange?: (dateISO: string) => void; 
  isSlotDisabled?: (dateISO: string, start24: string, end24: string) => boolean; 
}) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate ?? new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null); 
  const [busy, setBusy] = useState<BusySlot[]>([]);
  const [loadingBusy, setLoadingBusy] = useState(false);

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
    const hh = Math.floor((total + 24 * 60) % (24 * 60) / 60);
    const mm = (total + 24 * 60) % (24 * 60) % 60;
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
    let t = workingHours.start;
    while (t < workingHours.end) {
      slots.push(t);
      t = addMinutes(t, durationMin);
    }
    return slots;
  }, [workingHours.start, workingHours.end, durationMin]);

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
    
    // ← LLAMAR A onDateChange si existe
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

  // Cargar ocupados del profesional para la fecha elegida
  useEffect(() => {
    const run = async () => {
      if (!loadBusy || !profesionalId || !selectedDate) {
        console.log('No se puede cargar busy - falta:', { 
          loadBusy: !!loadBusy, 
          profesionalId, 
          selectedDate: !!selectedDate 
        });
        setBusy([]);
        return;
      }
      
      const dateISO = selectedDate.toISOString().slice(0, 10);
      console.log(`Cargando horarios ocupados para profesional ${profesionalId} el ${dateISO}`);
      
      try {
        setLoadingBusy(true);
        const items = await loadBusy({ profesionalId, dateISO });
        console.log('Horarios ocupados recibidos:', items);
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

  // Filtrar slots que se pisan con ocupados
  const availableSlots24 = useMemo(() => {
    if (!selectedDate) return allSlots24;
    
    const dateISO = selectedDate.toISOString().slice(0, 10);
    
    return allSlots24.filter((s) => {
      const end = addMinutes(s, durationMin);
      
      // 1. Chequear con busy slots (loadBusy)
      if (busy.length > 0) {
        const overlapped = busy.some(b => isOverlap(s, end, b.inicio, b.fin));
        if (overlapped) return false;
      }
      
      // 2. Chequear con isSlotDisabled (cache local)
      if (isSlotDisabled) {
        const disabled = isSlotDisabled(dateISO, s, end);
        if (disabled) return false;
      }
      
      return true;
    });
  }, [allSlots24, busy, durationMin, selectedDate, isSlotDisabled]);

  return (
    <div className="bg-white text-black md:rounded-2xl overflow-hidden shadow-2xl">
      {/* header bonito */}
      <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h1 className="text-2xl font-bold text-black">Selecciona fecha y hora</h1>
          <p className="text-gray-500 text-sm">Elige un día y un horario disponible</p>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex min-h-[500px]">
        {/* Calendario */}
        <div className="w-96 p-8 border-r border-gray-100 bg-gray-50/30">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigateMonth(-1)} className="p-3 hover:bg-white rounded-full border border-gray-200">
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold capitalize text-black">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={() => navigateMonth(1)} className="p-3 hover:bg-white rounded-full border border-gray-200">
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((d) => (
              <div key={d} className="p-3 text-center text-gray-500 font-semibold text-sm uppercase tracking-wide">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((day, i) => (
              <button
                key={i}
                onClick={() => selectDate(day)}
                disabled={isPastDate(day)}
                className={[
                  'h-12 w-12 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center',
                  !day ? 'invisible' : '',
                  isPastDate(day)
                    ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                    : 'hover:bg-white cursor-pointer text-gray-700 hover:shadow-md hover:scale-110 hover:-translate-y-1',
                  isToday(day)
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 border-2 border-blue-200 shadow-sm'
                    : '',
                  selectedDate && day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth()
                    ? 'bg-black text-white shadow-lg scale-110 -translate-y-1'
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
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-1 text-black">Horarios disponibles</h3>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${loadingBusy ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                  <p className="text-gray-600 font-medium">
                    {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {loadingBusy ? ' (cargando…) ' : ''}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-2 max-h-80 overflow-y-auto pr-2">
                {availableSlots24.length === 0 && (
                  <div className="text-gray-500 text-sm">No hay horarios disponibles.</div>
                )}
                {availableSlots24.map((t24) => {
                  const label = to12h(t24);
                  return (
                    <button
                      key={t24}
                      onClick={() => setSelectedTime(t24)}
                      className={[
                        'w-full p-3 text-left rounded-xl border transition-all duration-300 flex items-center justify-between',
                        selectedTime === t24
                          ? 'border-black bg-black text-white shadow-md'
                          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                      ].join(' ')}
                    >
                      <span className="font-medium text-base">{label}</span>
                      {selectedTime === t24 && (
                        <span className="text-xs text-white/80">Seleccionado</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end items-center">
                <button
                  onClick={handleConfirm}
                  disabled={!selectedTime}
                  className={[
                    'px-10 py-4 rounded-2xl font-bold text-lg',
                    selectedTime ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  ].join(' ')}
                >
                  {selectedTime ? 'Confirmar Cita' : 'Selecciona un horario'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Selecciona una fecha</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}