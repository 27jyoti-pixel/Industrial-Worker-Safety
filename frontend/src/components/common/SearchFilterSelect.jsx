import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  AlertTriangle,
  Bone,
  BadgeCheck,
  Check,
  CheckCircle2,
  Clock3,
  Cloud,
  Cog,
  FileText,
  Flame,
  FlaskConical,
  Layers,
  HeartPulse,
  Hospital,
  Leaf,
  MoreHorizontal,
  MapPin,
  Ruler,
  Search,
  ShieldAlert,
  Siren,
  XCircle,
  Zap,
  Wrench,
  ChevronDown,
  Stethoscope
} from 'lucide-react';

const optionIcons = {
  complaint: {
    'all complaint types': Layers,
    'fire hazard': Flame,
    'electrical hazard': Zap,
    'unsafe machinery': Cog,
    'broken equipment': Wrench,
    'gas leak': Cloud,
    'chemical spill': FlaskConical,
    'environmental issue': Leaf,
    other: MoreHorizontal
  },
  status: {
    'all statuses': Layers,
    submitted: FileText,
    reported: FileText,
    'under review': Search,
    'under investigation': Search,
    'in progress': Clock3,
    approved: CheckCircle2,
    resolved: CheckCircle2,
    closed: CheckCircle2,
    completed: BadgeCheck,
    rejected: XCircle
  },
  severity: {
    'all severities': Layers,
    minor: Layers,
    moderate: AlertTriangle,
    severe: ShieldAlert,
    high: ShieldAlert,
    critical: ShieldAlert,
    fatal: ShieldAlert
  },
  specialization: {
    'all specializations': Layers,
    cardiology: HeartPulse,
    'cardiac care': HeartPulse,
    emergency: Siren,
    'emergency care': Siren,
    'emergency medicine': Siren,
    icu: Activity,
    'intensive care': Activity,
    'intensive care unit': Activity,
    orthopedics: Bone,
    orthopedic: Bone,
    'trauma center': Siren,
    'trauma centre': Siren,
    trauma: Siren,
    hospital: Hospital
  }
};

const optionIconColors = {
  complaint: {
    'all complaint types': '#6B7280',
    'fire hazard': '#C94A4A',
    'electrical hazard': '#C08A2E',
    'unsafe machinery': '#9A7455',
    'broken equipment': '#D66A2C',
    'gas leak': '#C94A4A',
    'chemical spill': '#C08A2E',
    'environmental issue': '#5F8F6B',
    other: '#6B7280'
  },
  status: {
    'all statuses': '#6B7280',
    submitted: '#C08A2E',
    reported: '#C08A2E',
    'under review': '#718096',
    'under investigation': '#718096',
    'in progress': '#C08A2E',
    approved: '#5F8F6B',
    resolved: '#5F8F6B',
    closed: '#5F8F6B',
    completed: '#5F8F6B',
    rejected: '#C94A4A'
  },
  severity: {
    'all severities': '#6B7280',
    minor: '#5F8F6B',
    moderate: '#C08A2E',
    severe: '#D66A2C',
    critical: '#C94A4A',
    fatal: '#9F2F2F'
  },
  specialization: {
    'all specializations': '#6B7280',
    cardiology: '#B76E79',
    'cardiac care': '#B76E79',
    emergency: '#587A96',
    'emergency care': '#587A96',
    'emergency medicine': '#587A96',
    icu: '#706F9E',
    'intensive care': '#706F9E',
    'intensive care unit': '#706F9E',
    orthopedics: '#A96F43',
    orthopedic: '#A96F43',
    'trauma center': '#4F8491',
    'trauma centre': '#4F8491',
    trauma: '#4F8491'
  }
};

const resolveOptionIcon = (iconType, label) => {
  const normalizedLabel = String(label || '').trim().toLowerCase();
  return optionIcons[iconType]?.[normalizedLabel]
    || ({ location: MapPin, distance: Ruler, specialization: Stethoscope }[iconType] || null);
};

const resolveOptionIconColor = (iconType, label) => {
  const normalizedLabel = String(label || '').trim().toLowerCase();
  return optionIconColors[iconType]?.[normalizedLabel] || '#6B7280';
};

const SearchFilterSelect = ({
  label,
  value,
  options,
  onValueChange,
  allowClear = true,
  menuClassName = '',
  disabled = false,
  formField = false,
  iconType,
  matchSelectedOptionColor = false,
  name,
  required = false,
  placeholder
}) => {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const fieldId = useId();
  const displayableOptions = (Array.isArray(options) ? options : []).filter((option) => {
    const optionValue = typeof option === 'object' ? option?.value : option;
    const optionLabel = typeof option === 'object' ? option?.label : option;
    return optionValue !== null && optionValue !== undefined && optionValue !== ''
      && optionLabel !== null && optionLabel !== undefined && optionLabel !== '';
  });
  const canOpen = !disabled && displayableOptions.length > 0;
  const selectedOption = displayableOptions.find((option) =>
    (typeof option === 'object' ? option.value : option) === value
  );
  const selectedLabel = selectedOption
    ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption)
    : (formField ? (placeholder || label) : (value || label));
  const SelectedIcon = resolveOptionIcon(iconType, selectedLabel);

  const positionMenu = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const gap = 5;
    const desiredHeight = Math.min(displayableOptions.length * 38 + 10, 280);
    const below = window.innerHeight - rect.bottom - gap - 8;
    const above = rect.top - gap - 8;
    const openAbove = below < Math.min(desiredHeight, 190) && above > below;
    const available = Math.max(80, Math.min(280, openAbove ? above : below));
    const height = Math.min(desiredHeight, available);
    const width = Math.min(rect.width, window.innerWidth - 16);
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    const top = openAbove ? Math.max(8, rect.top - gap - height) : Math.min(rect.bottom + gap, window.innerHeight - height - 8);
    setMenuPosition({ top, left, width, maxHeight: available });
  };

  useEffect(() => {
    const closeOnOutsidePress = (event) => {
      if (!rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) setOpen(false);
    };
    const closeWhenAnotherOpens = (event) => {
      if (event.detail !== rootRef.current) setOpen(false);
    };

    document.addEventListener('mousedown', closeOnOutsidePress);
    document.addEventListener('search-filter-select-open', closeWhenAnotherOpens);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsidePress);
      document.removeEventListener('search-filter-select-open', closeWhenAnotherOpens);
    };
  }, []);

  useEffect(() => {
    if (!open || !formField) return undefined;
    positionMenu();
    const updatePosition = () => positionMenu();
    window.addEventListener('resize', updatePosition);
    document.addEventListener('scroll', updatePosition, true);
    const firstOption = menuRef.current?.querySelector('[role="option"]');
    firstOption?.focus();
    return () => {
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, formField, displayableOptions.length]);

  const toggleOpen = () => {
    if (!canOpen) return;
    if (!open) {
      if (formField) positionMenu();
      document.dispatchEvent(new CustomEvent('search-filter-select-open', { detail: rootRef.current }));
      setOpen(true);
      return;
    }
    setOpen(false);
  };

  const chooseOption = (nextValue) => {
    onValueChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (event, index) => {
    let nextIndex = null;
    if (event.key === 'ArrowDown') nextIndex = (index + 1) % displayableOptions.length;
    if (event.key === 'ArrowUp') nextIndex = (index - 1 + displayableOptions.length) % displayableOptions.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = displayableOptions.length - 1;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    } else if (nextIndex !== null) {
      event.preventDefault();
      menuRef.current?.querySelectorAll('[role="option"]')[nextIndex]?.focus();
    }
  };

  const menu = open && (
    <div
      ref={menuRef}
      className={`search-filter-menu ${formField ? 'dialog-select-menu' : ''} ${menuClassName}`}
      role="listbox"
      aria-label={label}
      style={formField && menuPosition ? {
        position: 'fixed',
        top: menuPosition.top,
        left: menuPosition.left,
        width: menuPosition.width,
        maxHeight: menuPosition.maxHeight
      } : undefined}
    >
      {allowClear && (!formField || !required) && (
        <button
          type="button"
          role="option"
          aria-selected={!value}
          className={`search-filter-option ${!value ? 'is-selected' : ''}`}
          onClick={() => chooseOption('')}
          onKeyDown={(event) => handleOptionKeyDown(event, 0)}
        >
          <span>{formField ? (placeholder || label) : label}</span>
          {!value && <Check className="h-4 w-4 text-[#E87532]" aria-hidden="true" />}
        </button>
      )}
      {displayableOptions.map((option, index) => {
        const optionValue = typeof option === 'object' ? option.value : option;
        const optionLabel = typeof option === 'object' ? option.label : option;
        const selected = value === optionValue;
        const optionIndex = index + (allowClear && (!formField || !required) ? 1 : 0);
        const OptionIcon = resolveOptionIcon(iconType, optionLabel);

        return (
          <button
            key={optionValue}
            type="button"
            role="option"
            aria-selected={selected}
            className={`search-filter-option ${selected ? 'is-selected' : ''}`}
            onClick={() => chooseOption(optionValue)}
            onKeyDown={(event) => handleOptionKeyDown(event, optionIndex)}
          >
            <span className="search-filter-option-content">
              {OptionIcon && <OptionIcon className="search-filter-option-icon" style={{ color: resolveOptionIconColor(iconType, optionLabel) }} aria-hidden="true" />}
              <span>{optionLabel}</span>
            </span>
            {selected && <Check className="h-4 w-4 text-[#E87532]" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={rootRef} className={`${formField ? 'dialog-search-filter-field' : 'search-filter-select relative'}`}>
      {formField && (
        <label id={`${fieldId}-label`} className="dialog-search-filter-label">
          {label} {required && <span className="text-[#E87532]">*</span>}
        </label>
      )}
      {formField && (
        <select
          name={name}
          value={value ?? ''}
          required={required}
          aria-hidden="true"
          tabIndex={-1}
          className="dialog-select-native"
          onChange={() => {}}
          onInvalid={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
            if (!open) toggleOpen();
          }}
        >
          <option value="">{placeholder || label}</option>
          {displayableOptions.map((option) => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
          })}
        </select>
      )}
      <button
        ref={triggerRef}
        type="button"
        data-icon-type={iconType || undefined}
        className={`${formField ? 'dialog-search-filter-trigger' : 'search-filter-trigger'} ${!canOpen ? 'is-disabled' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={!canOpen}
        aria-labelledby={formField ? `${fieldId}-label` : undefined}
        aria-required={formField ? required : undefined}
        onClick={toggleOpen}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false);
          if (formField && ['ArrowDown', 'Enter', ' '].includes(event.key)) {
            event.preventDefault();
            if (!open) toggleOpen();
          }
        }}
      >
        <span className="search-filter-selected-content">
          {SelectedIcon && (
            <SelectedIcon
              className="search-filter-selected-icon"
              style={matchSelectedOptionColor ? { color: resolveOptionIconColor(iconType, selectedLabel) } : undefined}
              aria-hidden="true"
            />
          )}
          <span>{selectedLabel}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {!formField && menu}
      {formField && menu && createPortal(menu, document.body)}
    </div>
  );
};

export default SearchFilterSelect;
