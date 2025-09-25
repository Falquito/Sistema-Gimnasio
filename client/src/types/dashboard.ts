// types/dashboard.ts
import type { LucideIcon } from 'lucide-react';

export interface StatData {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  color: string;
  icon: LucideIcon;
}

export interface QuickAction {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

export interface StatusConfig {
  color: string;
  label: string;
  icon: LucideIcon;
}

export interface DashboardStats {
  total: number;
  pendientes: number;
  completados: number;
  cancelados: number;
  hoyTurnos: number;
}

export interface FilterState {
  searchTerm: string;
  statusFilter: string;
}