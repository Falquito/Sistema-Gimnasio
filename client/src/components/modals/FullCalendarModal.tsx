import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { 
  Modal, 
  ModalTrigger, 
  ModalBody, 
  ModalContent, 
  ModalFooter 
} from '../ui/animated-modal';

interface CalendarModalContentProps {
  onScheduleAppointment?: (date: Date, time: string) => void;
}

const CalendarModalContent: React.FC<CalendarModalContentProps> = ({ onScheduleAppointment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generar horas disponibles de 8:00 AM a 8:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      const time24 = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time24);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Obtener días del mes
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Días vacíos al inicio
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const selectDate = (day: number | null) => {
    if (day) {
      const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(selected);
      setSelectedTime(null);
    }
  };

  const formatDate = (date: Date) => {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  const isToday = (day: number | null) => {
    const today = new Date();
    return day &&
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

  const handleScheduleAppointment = () => {
    if (selectedDate && selectedTime && onScheduleAppointment) {
      onScheduleAppointment(selectedDate, selectedTime);
      // Reset selections
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  return (
    <ModalBody className="bg-black border border-gray-800 max-w-4xl">
      <ModalContent className="p-0">
        {/* Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-800">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Calendario de Entrenamientos</h1>
            <p className="text-sm text-gray-400 mt-1">Selecciona fecha y hora para agendar</p>
          </div>
        </div>

        <div className="flex">
          {/* Calendar Section */}
          <div className="w-80 p-6 border-r border-gray-800">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
              <h2 className="text-lg font-semibold text-white capitalize">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button 
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-gray-400 font-medium text-xs">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => (
                <button
                  key={index}
                  onClick={() => selectDate(day)}
                  disabled={isPastDate(day)}
                  className={`
                    h-10 w-10 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center
                    ${!day ? 'invisible' : ''}
                    ${isPastDate(day) 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'hover:bg-gray-800 cursor-pointer text-gray-300'
                    }
                    ${isToday(day) ? 'bg-blue-600 text-white font-semibold' : ''}
                    ${selectedDate && 
                      day === selectedDate.getDate() && 
                      currentDate.getMonth() === selectedDate.getMonth()
                      ? 'bg-white text-black font-semibold' 
                      : ''
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-gray-400">Hoy</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-gray-400">Fecha seleccionada</span>
              </div>
            </div>
          </div>

          {/* Time Selection Section */}
          <div className="flex-1 p-6">
            {selectedDate ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Horarios Disponibles</span>
                  </h3>
                  <p className="text-sm text-gray-400 capitalize">
                    {formatDate(selectedDate)}
                  </p>
                </div>

                {/* Time slots in rows */}
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`
                        w-full p-4 text-left rounded-lg border transition-all duration-200 flex items-center justify-between group hover:scale-[1.01]
                        ${selectedTime === time
                          ? 'border-white bg-gray-800 shadow-lg'
                          : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                        }
                      `}
                    >
                      <span className="font-medium text-white">{time}</span>
                      {selectedTime === time && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-300 text-lg font-medium mb-2">
                    Selecciona una fecha
                  </p>
                  <p className="text-gray-500 text-sm">
                    Elige un día del calendario para ver horarios disponibles
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalContent>

      <ModalFooter className="border-t border-gray-800 bg-gray-900/50 p-4">
        <div className="flex justify-end space-x-3 w-full">
          <button 
            onClick={handleScheduleAppointment}
            disabled={!selectedDate || !selectedTime}
            className={`
              px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
              ${selectedDate && selectedTime 
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-lg shadow-green-500/25 hover:scale-105' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Calendar className="w-4 h-4" />
            <span>Agendar Turno</span>
          </button>
        </div>
      </ModalFooter>
    </ModalBody>
  );
};

const CalendarModalTrigger: React.FC<{ 
  children: React.ReactNode;
  onScheduleAppointment?: (date: Date, time: string) => void;
}> = ({ children, onScheduleAppointment }) => {
  return (
    <Modal>
      <ModalTrigger className="w-full h-full p-0 bg-transparent hover:bg-transparent text-left">
        {children}
      </ModalTrigger>
      <CalendarModalContent onScheduleAppointment={onScheduleAppointment} />
    </Modal>
  );
};

export default CalendarModalTrigger;