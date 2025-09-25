// components/AppointmentCalendar.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type AppointmentCalendarOnConfirm = (payload: {
  dateISO: string;        // "2025-10-04"
  time24: string;         // "21:00"
  endTime24: string;      // "21:30"
}) => void;

export default function AppointmentCalendar({
  initialDate,
  durationMin = 30,
  onConfirm,
  onClose,
}: {
  initialDate?: Date;
  durationMin?: number;
  onConfirm: AppointmentCalendarOnConfirm;
  onClose: () => void;
}) {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate ?? new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // 12h label

  // helpers
  const pad = (n: number) => n.toString().padStart(2, '0');
  const to24h = (label: string) => {
    // "1:00 PM" -> "13:00"
    const [hm, ampm] = label.split(' ');
    const [hStr, mStr] = hm.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${pad(h)}:${pad(m)}`;
  };
  const addMinutes = (time24: string, minutes: number) => {
    const [h, m] = time24.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const hh = Math.floor((total + 24 * 60) % (24 * 60) / 60);
    const mm = (total + 24 * 60) % (24 * 60) % 60;
    return `${pad(hh)}:${pad(mm)}`;
  };

  // 9:00 → 18:00 (cada hora)
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 9 + i;
    const label =
      hour === 12 ? '12:00 PM' :
      hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
    return label;
  });

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
  };

  const selectDate = (day: number | null) => {
    if (!day) return;
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setSelectedTime(null);
  };

  const formatDate = (date: Date) => {
    const days = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
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
    const time24 = to24h(selectedTime);
    const endTime24 = addMinutes(time24, durationMin);
    onConfirm({ dateISO, time24, endTime24 });
  };

  return (
    <div className="bg-white text-black md:rounded-2xl overflow-hidden shadow-2xl">
      {/* Header mejorado */}
      <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h1 className="text-2xl font-bold text-black mb-1">Selecciona fecha y hora</h1>
          <p className="text-gray-500 text-sm">Elige un día y un horario disponible</p>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex min-h-[500px]">
        {/* Calendario mejorado */}
        <div className="w-96 p-8 border-r border-gray-100 bg-gray-50/30">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigateMonth(-1)} 
              className="p-3 hover:bg-white rounded-full shadow-sm transition-all duration-200 hover:scale-105 border border-gray-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-xl font-bold capitalize text-black">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              onClick={() => navigateMonth(1)} 
              className="p-3 hover:bg-white rounded-full shadow-sm transition-all duration-200 hover:scale-105 border border-gray-200"
            >
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
                  'h-12 w-12 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center transform',
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

          {/* Leyenda mejorada */}
          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-black rounded-lg shadow-sm"></div>
              <span className="text-gray-600 font-medium">Seleccionado</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg"></div>
              <span className="text-gray-600 font-medium">Hoy</span>
            </div>
          </div>
        </div>

        {/* Lista de horarios mejorada */}
        <div className="flex-1 p-8">
          {selectedDate ? (
            <div className="h-full flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-3 text-black">Horarios disponibles</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-gray-600 capitalize font-medium">{formatDate(selectedDate)}</p>
                </div>
              </div>

              <div className="flex-1 space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
                {timeSlots.map((label, index) => (
                  <button
                    key={label}
                    onClick={() => setSelectedTime(label)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={[
                      'w-full p-3 text-left rounded-xl border transition-all duration-300 flex items-center justify-between group transform hover:scale-102 animate-fade-in',
                      selectedTime === label
                        ? 'border-black bg-black text-white shadow-md scale-102'
                        : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm'
                    ].join(' ')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={[
                        'w-2 h-2 rounded-full transition-all duration-300',
                        selectedTime === label ? 'bg-white' : 'bg-gray-300 group-hover:bg-gray-400'
                      ].join(' ')}></div>
                      <span className="font-medium text-base">{label}</span>
                    </div>
                    {selectedTime === label && (
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs text-white/80">Seleccionado</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {selectedTime && (
                    <span className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Duración: {durationMin} minutos</span>
                    </span>
                  )}
                </div>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedTime}
                  className={[
                    'px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform',
                    selectedTime 
                      ? 'bg-black text-white hover:bg-gray-800 hover:scale-105 shadow-lg hover:shadow-xl' 
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
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-gray-500 text-lg font-medium">Selecciona una fecha para continuar</p>
                <p className="text-gray-400 text-sm mt-2">Elige un día del calendario</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}