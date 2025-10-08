// components/calendar/ProfessionalCalendarView.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
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

function hhmmToDate(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(1970, 0, 1, h, m, 0, 0);
}

export default function ProfessionalCalendarView({ professionalId }: ProfessionalCalendarViewProps) {
  const [events, setEvents] = useState<CalendarEventRBC[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showTurnoModal, setShowTurnoModal] = useState(false);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEventRBC[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [workingHours, setWorkingHours] = useState<{ start: string; end: string }>({
    start: '09:00',
    end: '21:00',
  });

  const handleShowMore = (events: any[], date: Date) => {
    setSelectedDayEvents(events as CalendarEventRBC[]);
    setSelectedDate(date);
    setShowDayEventsModal(true);
  };

  const loadMyTurnos = async (start?: Date, end?: Date) => {
    setLoading(true);
    try {
      const startStr = start ? start.toISOString().split('T')[0] : undefined;
      const endStr = end ? end.toISOString().split('T')[0] : undefined;

      const calendarEvents = await turnosApi.getCalendarEvents({
        profesionalId: professionalId,
        desde: startStr,
        hasta: endStr,
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
    if (!professionalId) return;

    turnosApi
      .getWorkingHours(professionalId)
      .then(setWorkingHours)
      .catch(() => setWorkingHours({ start: '09:00', end: '21:00' }));

    loadMyTurnos();

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
        <span className="event-status-text">
          {(turno?.estado || 'Pendiente').toString().toLowerCase()}
        </span>
      </div>
    );
  };

  const CustomToolbar = ({ onNavigate, onView, view, label }: any) => (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      {/* Navegación */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onNavigate('PREV')} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>
        <button 
          onClick={() => onNavigate('TODAY')} 
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:from-green-500 hover:to-green-400 transition-all"
        >
          Hoy
        </button>
        <button 
          onClick={() => onNavigate('NEXT')} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Título central */}
      <h2 className="text-xl font-bold text-gray-900 capitalize">{label}</h2>

      {/* Selector de vista */}
      <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
        <button
          onClick={() => onView(Views.MONTH)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            view === Views.MONTH
              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-white hover:text-green-600'
          }`}
        >
          Mes
        </button>
        <button
          onClick={() => onView(Views.WEEK)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            view === Views.WEEK
              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-white hover:text-green-600'
          }`}
        >
          Semana
        </button>
        <button
          onClick={() => onView(Views.DAY)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            view === Views.DAY
              ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md'
              : 'text-gray-700 hover:bg-white hover:text-green-600'
          }`}
        >
          Día
        </button>
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
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
                <p className="text-gray-700 font-medium">Cargando turnos...</p>
              </div>
            </div>
          </div>
        )}

        <Calendar
          localizer={localizer}
          events={events}
          onShowMore={handleShowMore}
          popup={false}
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
          min={hhmmToDate(workingHours.start)}
          max={hhmmToDate(workingHours.end)}
          dayLayoutAlgorithm="no-overlap"
        />
      </div>

      {/* Modal de eventos del día */}
      {showDayEventsModal && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Turnos del {moment(selectedDate).format('dddd DD [de] MMMM')}
              </h3>
              <button
                onClick={() => setShowDayEventsModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              {selectedDayEvents.length} turnos programados
            </div>

            <div className="overflow-y-auto flex-1 space-y-2">
              {selectedDayEvents
                .sort((a, b) => a.start.getTime() - b.start.getTime())
                .map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedTurno(event.resource);
                      setShowDayEventsModal(false);
                      setShowTurnoModal(true);
                    }}
                    className="w-full text-left p-4 rounded-lg border border-gray-100 hover:border-green-300 hover:bg-green-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.resource.estado?.toLowerCase() === 'pendiente'
                            ? 'bg-green-100 text-green-700'
                            : event.resource.estado?.toLowerCase() === 'completado'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {event.resource.estado}
                      </span>
                    </div>
                  </button>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowDayEventsModal(false)}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal detalle turno */}
      {showTurnoModal && selectedTurno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Detalles del Turno</h3>
              <button
                onClick={() => setShowTurnoModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="bg-green-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedTurno.idCliente?.nombre} {selectedTurno.idCliente?.apellido}
                  </div>
                  <div className="text-sm text-gray-600">Paciente</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-emerald-600" />
                </div>
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
                <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Observaciones</div>
                    <div className="text-sm text-gray-600 mt-1">{selectedTurno.observacion}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="font-semibold text-gray-700">Estado:</span>
                <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-600 to-green-500 text-white">
                  {selectedTurno.estado.charAt(0).toUpperCase() + selectedTurno.estado.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTurnoModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .rbc-show-more {
          background: linear-gradient(to right, #16a34a, #22c55e) !important;
          color: white !important;
          padding: 6px 12px !important;
          border-radius: 8px !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          border: none !important;
        }
        .rbc-show-more:hover {
          background: linear-gradient(to right, #15803d, #16a34a) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(34, 197, 94, 0.3) !important;
        }
      `}</style>
    </>
  );
}