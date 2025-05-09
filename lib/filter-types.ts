import { LucideIcon } from 'lucide-react';

export type FilterType = string;

export interface FilterCondition {
  id: string;
  label: string;
}

export interface FilterOption {
  type: FilterType;
  label: string;
  icon: LucideIcon;
  values: { id: string; label: string }[];
  conditions: FilterCondition[];
}

export type FilterStatus = 'draft' | 'inProgress' | 'completed';

export interface FilterCriteria {
  id: string;
  type: FilterType;
  condition: string;
  value: string;
  status?: FilterStatus;
}

export interface FilterProps {
  options: FilterOption[];
  onFilterChange?: (filters: FilterCriteria[]) => void;
  autoOpenDropdown?: boolean;
  className?: string;
}
