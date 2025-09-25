// hooks/useTurnos.ts - Custom React Hooks
import { useState, useEffect } from 'react';
import { turnosApi } from '../services/turnos.services';
import type { Turno, DisponibilidadResponse, DisponibilidadQuery } from '../types/turnos';

export const useTurnos = (clienteId?: number, estado?: string) => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        setLoading(true);
        const data = await turnosApi.listarTurnos(clienteId, estado);
        setTurnos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar turnos');
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, [clienteId, estado]);

  const refetch = () => {
    setError(null);
    const fetchTurnos = async () => {
      try {
        setLoading(true);
        const data = await turnosApi.listarTurnos(clienteId, estado);
        setTurnos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar turnos');
      } finally {
        setLoading(false);
      }
    };
    fetchTurnos();
  };

  return { turnos, loading, error, refetch };
};

export const useDisponibilidad = (query: DisponibilidadQuery | null) => {
  const [disponibilidad, setDisponibilidad] = useState<DisponibilidadResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;

    const fetchDisponibilidad = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await turnosApi.getDisponibilidad(query);
        setDisponibilidad(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar disponibilidad');
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilidad();
  }, [query]);

  return { disponibilidad, loading, error };
};