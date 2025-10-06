// components/calendar/ProfessionalCalendarView.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import type {View } from 'react-big-calendar';
import moment from 'moment';
import { Calendar as CalendarIcon, Clock, User, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';

import { turnosApi } from '../../services/turnos.services';
import type { Turno } from '../../types/turnos';

moment.updateLocale('es', {
  months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
  monthsShort: 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_'),
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sá'.split('_'),
});

const localizer = momentLocalizer(moment);

interface ProfessionalCalendarViewProps {
  professionalId: number;
}

interface CalendarEventRBC {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Turno;
}

export default function ProfessionalCalendarView({ professionalId }: ProfessionalCalendarViewProps) {
  const [events, setEvents] = useState<CalendarEventRBC[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const loadMyTurnos = async (start?: Date, end?: Date) => {
    setLoading(true);
    try {
      const startStr = start ? start.toISOString().split('T')[0] : undefined;
      const endStr = end ? end.toISOString().split('T')[0] : undefined;

      const calendarEvents = await turnosApi.getCalendarEvents({
        profesionalId: professionalId,
        desde: startStr,
        hasta: endStr,
        estado: 'PENDIENTE',
        incluirCancelados: false,
      });

      const rbcEvents: CalendarEventRBC[] = calendarEvents.map((ev: any) => {
        const startD = new Date(ev.start);
        const endD = new Date(startD.getTime() + 60 * 60 * 1000);

        const turno: Turno | undefined = ev.extendedProps?.turno;
        const nombre = turno
          ? `${turno.idCliente?.nombre ?? ''} ${turno.idCliente?.apellido ?? ''}`.trim()
          : ev.title;

        return {
          id: ev.id,
          title: nombre || 'Paciente',
          start: startD,
          end: endD,
          resource: (turno ?? ({} as Turno)),
        };
      });

      setEvents(rbcEvents);
    } catch (error) {
      console.error('Error loading my turnos:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (professionalId) loadMyTurnos();

    const handleFocus = () => professionalId && loadMyTurnos();
    const handleVisibilityChange = () => {
      if (!document.hidden && professionalId) loadMyTurnos();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [professionalId]);

  const handleRangeChange = (range: Date[] | { start: Date; end: Date }) => {
    if (Array.isArray(range)) loadMyTurnos(range[0], range[range.length - 1]);
    else loadMyTurnos(range.start, range.end);
  };

  const handleSelectEvent = (event: CalendarEventRBC) => {
    setSelectedTurno(event.resource);
    setShowTurnoModal(true);
  };

  const EventComponent = ({ event }: { event: CalendarEventRBC }) => {
    const turno = event.resource;
    const statusClass = getStatusClass(turno?.estado || 'default');

    return (
      <div className={`clean-event ${statusClass}`}>
       
       
          <div className="event-patient-name">{event.title}</div>
            <span className="event-status-text">{(turno?.estado || 'Pendiente').toString().toLowerCase()}</span>
         
        </div>
      
    );
  };

  const CustomToolbar = ({ onNavigate, onView, view, label }: any) => (
    <div className="modern-toolbar">
      <div className="toolbar-section">
        <div className="nav-controls">
          <button onClick={() => onNavigate('PREV')} className="nav-button">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => onNavigate('TODAY')} className="today-button">
            Hoy
          </button>
          <button onClick={() => onNavigate('NEXT')} className="nav-button">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="toolbar-center">
        <h2 className="calendar-title">{label}</h2>
      </div>

      <div className="toolbar-section">
        <div className="view-selector">
          <button
            onClick={() => onView(Views.MONTH)}
            className={`view-button ${view === Views.MONTH ? 'active' : ''}`}
          >
            Mes
          </button>
          <button
            onClick={() => onView(Views.WEEK)}
            className={`view-button ${view === Views.WEEK ? 'active' : ''}`}
          >
            Semana
          </button>
          <button
            onClick={() => onView(Views.DAY)}
            className={`view-button ${view === Views.DAY ? 'active' : ''}`}
          >
            Día
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusClass = (estado: string): string => {
    switch (estado.toLowerCase()) {
      case 'confirmado':
      case 'pendiente':
        return 'status-confirmed';
      case 'cancelado':
        return 'status-cancelled';
      case 'completado':
        return 'status-completed';
      case 'reprogramado':
        return 'status-rescheduled';
      default:
        return 'status-default';
    }
  };

  // Formatos
  const formats = {
    timeGutterFormat: 'HH:mm',
    eventTimeRangeFormat: ({ start, end }: any) =>
      `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
    dayFormat: 'ddd DD/MM',
    dayHeaderFormat: 'dddd DD [de] MMMM',
    monthHeaderFormat: 'MMMM YYYY',
  };

  const messages = {
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    allDay: 'Todo el día',
    noEventsInRange: 'No hay turnos en este período',
    showMore: (total: number) => `+ Ver ${total} más`,
  };

  const eventPropGetter = () => ({
    style: {
      backgroundColor: 'transparent',
      border: 'none',
      padding: 0,
      color: 'inherit',
    },
    className: 'no-default-rbc-event',
  });

  return (
    <>

      {/* Calendario con spinner */}
      <div className="calendar-wrapper">
        {loading && (
          <div className="calendar-loading">
            <div className="loading-content">
              <div className="spinner"></div>
              <p className="loading-text">Cargando turnos...</p>
            </div>
          </div>
        )}

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 'calc(100vh - 200px)',
            opacity: loading ? 0.3 : 1,
            transition: 'opacity 0.3s ease',
          }}
          onSelectEvent={handleSelectEvent}
          onRangeChange={handleRangeChange}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          formats={formats}
          messages={messages}
          components={{ toolbar: CustomToolbar, event: EventComponent }}
          eventPropGetter={eventPropGetter}
          step={30}
          timeslots={2}
          min={new Date(2024, 0, 1, 8, 0)}
          max={new Date(2024, 0, 1, 20, 0)}
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      {/* Modal */}
      {showTurnoModal && selectedTurno && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Turno</h3>
              <button
                onClick={() => setShowTurnoModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedTurno.idCliente?.nombre} {selectedTurno.idCliente?.apellido}
                  </div>
                  <div className="text-sm text-gray-600">Paciente</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">
                    {new Date(selectedTurno.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedTurno.horaInicio}
                    {selectedTurno.horaFin && ` - ${selectedTurno.horaFin}`}
                  </div>
                </div>
              </div>

              {selectedTurno.observacion && (
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">Observaciones</div>
                    <div className="text-sm text-gray-600 mt-1">{selectedTurno.observacion}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Estado:</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium text-white bg-green-500">
                  {selectedTurno.estado.charAt(0).toUpperCase() + selectedTurno.estado.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTurnoModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    <style>
      ''
        
    </style>
      
    </>
  );
}
