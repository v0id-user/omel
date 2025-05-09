'use client';

import React, { useRef, useEffect } from 'react';
import { SlidersHorizontal, X, ChevronDown, Plus } from 'lucide-react';
import { createPortal } from 'react-dom';
import {
  FilterProps,
  FilterCriteria,
  FilterType,
  FilterCondition,
  FilterOption,
} from '@/lib/filter-types';
import { useFilter } from '@/hooks/useFilter';
import { filterBlockStyles } from '@/lib/filter-styles';

const animationStyles = {
  dropdownContainer: 'animate-[slideIn_0.2s_ease-out_forwards]',
  dropdownItem: 'animate-[fadeIn_0.2s_ease-out_forwards]',
};

const keyframes = `
@keyframes slideIn {
    from {
        transform: translateY(-8px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

interface FilterItemProps {
  icon: React.ElementType;
  label: string;
  onRemove: () => void;
}

const FilterItem: React.FC<FilterItemProps> = ({ icon: Icon, label, onRemove }) => (
  <div className={filterBlockStyles.filterItem}>
    <Icon className="w-3 h-3" />
    <span>{label}</span>
    <button onClick={onRemove} className="text-gray-400 hover:text-red-500 mr-1">
      <X className="w-3 h-3" />
    </button>
  </div>
);

interface ConditionSelectorProps {
  condition: FilterCondition;
  onRemove: () => void;
}

const ConditionSelector: React.FC<ConditionSelectorProps> = ({ condition, onRemove }) => (
  <div className={filterBlockStyles.filterItem}>
    <span>{condition.label}</span>
    <button onClick={onRemove} className="text-gray-400 hover:text-red-500 mr-1">
      <X className="w-3 h-3" />
    </button>
  </div>
);

interface DropdownPortalProps {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLDivElement | HTMLButtonElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

const DropdownPortal: React.FC<DropdownPortalProps> = ({
  children,
  targetRef,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!targetRef.current?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, onClose, targetRef]);

  if (!isOpen || !targetRef.current) return null;

  const rect = targetRef.current.getBoundingClientRect();
  const portalContent = (
    <>
      <style>{keyframes}</style>
      <div
        className={`${filterBlockStyles.dropdownContainer} ${animationStyles.dropdownContainer}`}
        style={{
          top: `${rect.bottom + 4}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );

  return createPortal(portalContent, document.body);
};

interface TypeSelectorDropdownProps {
  options: FilterOption[];
  onSelect: (type: FilterType) => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

const TypeSelectorDropdown: React.FC<TypeSelectorDropdownProps> = ({
  options,
  onSelect,
  targetRef,
  isOpen,
  onClose,
}) => (
  <DropdownPortal targetRef={targetRef} isOpen={isOpen} onClose={onClose}>
    <div className={`flex flex-col gap-1 ${animationStyles.dropdownItem}`}>
      {options.map(option => (
        <button
          key={option.type}
          onClick={() => onSelect(option.type)}
          className="w-full cursor-pointer p-1.5 text-xs rounded-md hover:bg-gray-50 text-right flex items-center justify-start gap-1.5 transition-colors duration-200"
        >
          <option.icon className="w-3.5 h-3.5" />
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  </DropdownPortal>
);

interface ConditionDropdownProps {
  conditions: FilterCondition[];
  onSelect: (condition: FilterCondition) => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

const ConditionDropdown: React.FC<ConditionDropdownProps> = ({
  conditions,
  onSelect,
  targetRef,
  isOpen,
  onClose,
}) => (
  <DropdownPortal targetRef={targetRef} isOpen={isOpen} onClose={onClose}>
    <div className={`flex flex-col gap-1 ${animationStyles.dropdownItem}`}>
      {conditions.map(condition => (
        <button
          key={condition.id}
          onClick={() => onSelect(condition)}
          className="w-full cursor-pointer p-1.5 text-xs rounded-md hover:bg-gray-50 text-right transition-colors duration-200"
        >
          {condition.label}
        </button>
      ))}
    </div>
  </DropdownPortal>
);

interface ValueSelectorProps {
  onClick: (e: React.MouseEvent) => void;
  targetRef: React.RefObject<HTMLDivElement | null>;
}

const ValueSelector: React.FC<ValueSelectorProps> = ({ onClick, targetRef }) => (
  <div
    className={`${filterBlockStyles.filterItem} cursor-pointer text-gray-500 relative value-selector`}
    onClick={onClick}
    ref={targetRef}
  >
    <span>اختر القيمة</span>
    <ChevronDown className="w-3 h-3 mr-1" />
  </div>
);

interface ActiveFilterProps {
  filter: FilterCriteria;
  options: FilterOption[];
  onRemove: () => void;
  onTypeClick: (typeRef: React.RefObject<HTMLDivElement | null>) => void;
  onConditionClick: (conditionRef: React.RefObject<HTMLDivElement | null>) => void;
  onValueClick: (valueRef: React.RefObject<HTMLDivElement | null>) => void;
  isBeingEdited?: boolean;
}

const ActiveFilter: React.FC<ActiveFilterProps> = ({
  filter,
  options,
  onRemove,
  onTypeClick,
  onConditionClick,
  onValueClick,
  isBeingEdited = false,
}) => {
  const option = options.find(opt => opt.type === filter.type);
  const value = option?.values.find(v => v.id === filter.value);
  const condition = option?.conditions.find(c => c.id === filter.condition);
  const Icon = option?.icon;

  const typeRef = useRef<HTMLDivElement>(null);
  const conditionRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);

  return (
    <div className={filterBlockStyles.filterGroup}>
      <div
        ref={typeRef}
        className={`${filterBlockStyles.filterItem} cursor-pointer`}
        onClick={() => onTypeClick(typeRef)}
      >
        {Icon && <Icon className="w-3 h-3" />}
        <span>{option?.label}</span>
      </div>
      <div className={filterBlockStyles.separator} />
      <div
        ref={conditionRef}
        className={`${filterBlockStyles.filterItem} cursor-pointer`}
        onClick={() => onConditionClick(conditionRef)}
      >
        {condition?.label}
      </div>
      <div className={filterBlockStyles.separator} />
      <div
        ref={valueRef}
        className={`${filterBlockStyles.filterItem} group cursor-pointer`}
        onClick={() => onValueClick(valueRef)}
      >
        <span>{value?.label}</span>
        {!isBeingEdited && (
          <button
            onClick={e => {
              e.stopPropagation();
              onRemove();
            }}
            className="cursor-pointer text-gray-400 hover:text-red-500 opacity-85 group-hover:opacity-100 transition-opacity mr-1"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default function Filter({
  options,
  onFilterChange,
  autoOpenDropdown = false,
  className = '',
}: FilterProps) {
  const {
    isOpen,
    setIsOpen,
    activeFilters,
    selectedType,
    selectedCondition,
    showConditions,
    setShowConditions,
    showValues,
    setShowValues,
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
    editMode,
    setEditRef,
    editRef,
    draftFilter,
  } = useFilter({ autoOpenDropdown });

  useEffect(() => {
    onFilterChange?.(activeFilters);
  }, [activeFilters, onFilterChange]);

  const selectedOption = options.find(opt => opt.type === selectedType);

  // Check if a filter is being edited
  const isEditingFilter = draftFilter?.originalIndex !== undefined;
  // Check if we should show the add button - only show if there's at least one filter already
  const showAddButton = !selectedType && !isEditingFilter && activeFilters.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className={filterBlockStyles.container}>
        {activeFilters.length === 0 && !selectedType && (
          <div
            ref={addFilterBtnRef}
            onClick={toggleFilterDropdown}
            className={filterBlockStyles.addFilterBtn}
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>تصفية</span>
          </div>
        )}

        {/* Always display all active filters */}
        {activeFilters.map((filter, index) => (
          <ActiveFilter
            key={filter.id ?? index}
            filter={filter}
            options={options}
            onRemove={() => removeFilter(index)}
            onTypeClick={ref => {
              setEditRef(ref);
              editFilter(filter, index);
            }}
            onConditionClick={ref => {
              setEditRef(ref);
              editFilterCondition(filter, index);
            }}
            onValueClick={ref => {
              setEditRef(ref);
              editFilterValue(filter, index);
            }}
            isBeingEdited={isEditingFilter && draftFilter?.originalIndex === index}
          />
        ))}

        {/* Only show the add button once at the end if we're not in edit mode */}
        {showAddButton && (
          <div
            ref={addFilterBtnRef}
            onClick={toggleFilterDropdown}
            className={filterBlockStyles.addFilterBtn}
          >
            <Plus className="w-3 h-3" />
          </div>
        )}

        {/* Only show this when creating a new filter (not when editing an existing one) */}
        {selectedType && selectedOption && !isEditingFilter && (
          <div className={filterBlockStyles.filterGroup}>
            <FilterItem
              icon={selectedOption.icon}
              label={selectedOption.label}
              onRemove={removeDraftFilter}
            />

            {!selectedCondition && (
              <>
                <div className={filterBlockStyles.separator} />
                <div
                  ref={conditionBtnRef}
                  onClick={() => setShowConditions(true)}
                  className={`${filterBlockStyles.filterItem} cursor-pointer text-gray-500`}
                >
                  <span>اختر الشرط</span>
                  <ChevronDown className="w-3 h-3 mr-1" />
                </div>
              </>
            )}

            {selectedCondition && (
              <>
                <div className={filterBlockStyles.separator} />
                <ConditionSelector condition={selectedCondition} onRemove={removeDraftFilter} />
                <div className={filterBlockStyles.separator} />
                <ValueSelector onClick={handleValueClick} targetRef={valueSelectorRef} />
              </>
            )}
          </div>
        )}
      </div>

      <TypeSelectorDropdown
        options={options}
        onSelect={handleTypeSelect}
        targetRef={editRef || addFilterBtnRef}
        isOpen={isOpen && !selectedType}
        onClose={() => setIsOpen(false)}
      />

      {selectedOption && (
        <ConditionDropdown
          conditions={selectedOption.conditions}
          onSelect={handleConditionSelect}
          targetRef={editMode === 'condition' ? editRef || conditionBtnRef : conditionBtnRef}
          isOpen={showConditions}
          onClose={() => setShowConditions(false)}
        />
      )}

      {selectedOption && selectedCondition && (
        <DropdownPortal
          targetRef={editMode === 'value' ? editRef || valueSelectorRef : valueSelectorRef}
          isOpen={showValues}
          onClose={() => setShowValues(false)}
        >
          <div className="flex flex-col gap-1 animate-slide-in">
            {selectedOption.values.map(value => (
              <div
                key={value.id}
                className={filterBlockStyles.valueDropdown}
                onClick={e => handleValueSelect(e, value.id, value.label)}
              >
                {value.label}
              </div>
            ))}
          </div>
        </DropdownPortal>
      )}
    </div>
  );
}
