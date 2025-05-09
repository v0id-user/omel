import { useState, useRef, useCallback } from 'react';
import { FilterType, FilterCondition, FilterCriteria, FilterStatus } from '@/lib/filter-types';

interface UseFilterOptions {
  autoOpenDropdown?: boolean;
}

type FilterState = {
  isOpen: boolean;
  activeFilters: FilterCriteria[];
  draftFilter: {
    type: FilterType | null;
    condition: FilterCondition | null;
    value?: string;
    originalIndex?: number;
  } | null;
  showConditions: boolean;
  showValues: boolean;
  editMode: 'full' | 'condition' | 'value' | null;
  editRef: React.RefObject<HTMLDivElement | null> | null;
};

export function useFilter({ autoOpenDropdown = false }: UseFilterOptions = {}) {
  const [state, setState] = useState<FilterState>({
    isOpen: false,
    activeFilters: [],
    draftFilter: null,
    showConditions: false,
    showValues: false,
    editMode: null,
    editRef: null,
  });

  const addFilterBtnRef = useRef<HTMLDivElement>(null);
  const conditionBtnRef = useRef<HTMLDivElement>(null);
  const valueSelectorRef = useRef<HTMLDivElement>(null);

  const resetDraftFilter = useCallback(() => {
    setState(prev => ({
      ...prev,
      draftFilter: null,
      showConditions: false,
      showValues: false,
      isOpen: false,
      editMode: null,
      editRef: null,
    }));
  }, []);

  const handleValueClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setState(prev => ({
      ...prev,
      showValues: true,
      showConditions: false,
      isOpen: false,
    }));
  }, []);

  const generateId = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;

  // Generic helper to update an existing filter in place
  const updateExistingFilter = useCallback(
    (prev: FilterState, index: number, data: Partial<Omit<FilterCriteria, 'id'>>) => {
      const current = prev.activeFilters[index];
      if (!current) return prev.activeFilters;
      const updated: FilterCriteria = {
        ...current,
        ...data,
        // Make sure we always have an id & completed status
        id: current.id || generateId(),
        status: 'completed' as FilterStatus,
      };
      const next = [...prev.activeFilters];
      next[index] = updated;
      return next;
    },
    []
  );

  // Centralised edit entry-point to cut duplication between the three public edit helpers
  const startEdit = useCallback(
    (filter: FilterCriteria, index: number, mode: 'full' | 'condition' | 'value') => {
      setState(prev => {
        const draft: NonNullable<FilterState['draftFilter']> = {
          type: filter.type,
          condition:
            mode === 'value' || mode === 'full' ? { id: filter.condition, label: '' } : null,
          value: mode === 'value' ? undefined : filter.value,
          originalIndex: index,
        };

        return {
          ...prev,
          draftFilter: draft,
          showConditions: mode === 'condition',
          showValues: mode === 'value',
          isOpen: false,
          editMode: mode,
        };
      });
    },
    []
  );

  const handleValueSelect = useCallback(
    (e: React.MouseEvent, value: string, label: string) => {
      e.stopPropagation();

      setState(prev => {
        // Editing an existing filter
        if (prev.draftFilter?.originalIndex !== undefined && prev.draftFilter?.type) {
          const newActiveFilters = updateExistingFilter(prev, prev.draftFilter.originalIndex, {
            type: prev.draftFilter.type,
            condition: prev.draftFilter.condition?.id || '',
            value,
          });

          return {
            ...prev,
            activeFilters: newActiveFilters,
            draftFilter: null,
            showValues: false,
            isOpen: false,
            editMode: null,
            editRef: null,
          };
        }

        // --- Creation flow
        if (prev.draftFilter?.type && prev.draftFilter?.condition) {
          const newFilter: FilterCriteria = {
            id: generateId(),
            type: prev.draftFilter.type,
            condition: prev.draftFilter.condition.id,
            value,
            status: 'completed' as FilterStatus,
          };

          const nextState = {
            ...prev,
            activeFilters: [...prev.activeFilters, newFilter],
            draftFilter: null,
            showValues: false,
            isOpen: false,
            editMode: null,
            editRef: null,
          };

          // If autoOpenDropdown is enabled, schedule the next dropdown to open
          if (autoOpenDropdown) {
            setTimeout(() => {
              setState(s => ({
                ...s,
                isOpen: true,
              }));
            }, 50);
          }

          return nextState;
        }

        return prev; // Fallback – nothing to change
      });
    },
    [autoOpenDropdown, updateExistingFilter]
  );

  const handleTypeSelect = useCallback((type: FilterType) => {
    setState(prev => ({
      ...prev,
      draftFilter: {
        type,
        condition: null,
        originalIndex: prev.draftFilter?.originalIndex,
      },
      isOpen: false,
      showConditions: true,
      showValues: false,
      editMode: prev.editMode,
    }));
  }, []);

  const handleConditionSelect = useCallback(
    (condition: FilterCondition) => {
      setState(prev => {
        if (
          prev.editMode === 'condition' &&
          prev.draftFilter?.originalIndex !== undefined &&
          prev.draftFilter?.type
        ) {
          const newActiveFilters = updateExistingFilter(prev, prev.draftFilter.originalIndex, {
            type: prev.draftFilter.type,
            condition: condition.id,
            value: prev.draftFilter.value || '',
          });

          return {
            ...prev,
            activeFilters: newActiveFilters,
            draftFilter: null,
            showConditions: false,
            showValues: false,
            editMode: null,
            editRef: null,
          };
        }

        const nextState = {
          ...prev,
          draftFilter: prev.draftFilter
            ? {
                ...prev.draftFilter,
                condition,
              }
            : null,
          showConditions: false,
          showValues: true,
        };

        // If autoOpenDropdown is enabled, schedule the next dropdown to open
        if (autoOpenDropdown) {
          setTimeout(() => {
            setState(s => ({
              ...s,
              isOpen: true,
            }));
          }, 50);
        }

        return nextState;
      });
    },
    [autoOpenDropdown, updateExistingFilter]
  );

  const removeFilter = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      activeFilters: prev.activeFilters.filter((_, i) => i !== index),
    }));
  }, []);

  const editFilter = useCallback(
    (filter: FilterCriteria, index: number) => startEdit(filter, index, 'full'),
    [startEdit]
  );

  const editFilterCondition = useCallback(
    (filter: FilterCriteria, index: number) => startEdit(filter, index, 'condition'),
    [startEdit]
  );

  const editFilterValue = useCallback(
    (filter: FilterCriteria, index: number) => startEdit(filter, index, 'value'),
    [startEdit]
  );

  const removeDraftFilter = useCallback(() => {
    resetDraftFilter();
  }, [resetDraftFilter]);

  const toggleFilterDropdown = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      draftFilter: prev.isOpen ? null : prev.draftFilter,
    }));
  }, []);

  const setEditRef = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    setState(prev => ({
      ...prev,
      editRef: ref,
    }));
  }, []);

  return {
    isOpen: state.isOpen,
    setIsOpen: (isOpen: boolean) => setState(prev => ({ ...prev, isOpen })),
    activeFilters: state.activeFilters,
    selectedType: state.draftFilter?.type ?? null,
    selectedCondition: state.draftFilter?.condition ?? null,
    showConditions: state.showConditions,
    setShowConditions: (show: boolean) => setState(prev => ({ ...prev, showConditions: show })),
    showValues: state.showValues,
    setShowValues: (show: boolean) => setState(prev => ({ ...prev, showValues: show })),
    addFilterBtnRef,
    conditionBtnRef,
    valueSelectorRef,
    handleValueClick,
    handleValueSelect,
    handleTypeSelect,
    handleConditionSelect,
    removeFilter,
    editFilter,
    editFilterCondition,
    editFilterValue,
    removeDraftFilter,
    toggleFilterDropdown,
    editMode: state.editMode,
    setEditRef,
    editRef: state.editRef,
    draftFilter: state.draftFilter,
  };
}
