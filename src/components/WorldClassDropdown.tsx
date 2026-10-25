import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  chipClass?: string;
}

export interface WorldClassDropdownProps {
  id?: string;
  name?: string;
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  variant?: 'light' | 'dark' | 'compact' | 'status-badge';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  menuClassName?: string;
  ariaLabel?: string;
}

export const WorldClassDropdown: React.FC<WorldClassDropdownProps> = ({
  id,
  name,
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Select an option...',
  variant = 'light',
  size = 'md',
  icon: LeadingIcon,
  searchable = false,
  disabled = false,
  error,
  className = '',
  menuClassName = '',
  ariaLabel
}) => {
  const generatedId = useId();
  const dropdownId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options when searchable is active
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query) ||
        opt.value.toLowerCase().includes(query) ||
        opt.badge?.toLowerCase().includes(query)
    );
  }, [options, searchable, searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery('');
          onBlur?.();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onBlur]);

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  // Scroll active/highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      const target = items[highlightedIndex] as HTMLElement;
      if (target) {
        target.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // When opening, set highlighted to currently selected item
  useEffect(() => {
    if (isOpen) {
      const idx = filteredOptions.findIndex((opt) => opt.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, value, filteredOptions]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
    buttonRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      case 'Enter':
      case ' ':
        if (e.target === searchInputRef.current && e.key === ' ') {
          // Allow spaces in search input
          return;
        }
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        buttonRef.current?.focus();
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchQuery('');
        onBlur?.();
        break;
      default:
        break;
    }
  };

  // Size styling
  const sizeClasses = {
    sm: 'py-1.5 px-2.5 text-xs rounded-lg',
    md: 'py-2.5 px-3.5 text-xs sm:text-sm rounded-xl',
    lg: 'py-3.5 px-4 text-sm sm:text-base rounded-xl'
  }[size];

  // Variant themes
  const getTriggerClasses = () => {
    const base = 'w-full flex items-center justify-between gap-2.5 text-left font-sans transition-all duration-200 select-none cursor-pointer focus:outline-none';

    if (disabled) {
      return `${base} opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200`;
    }

    if (variant === 'status-badge') {
      const chip = selectedOption?.chipClass || 'bg-navy-900 text-slate-200 border-navy-700';
      return `${base} font-mono font-bold text-xs py-1.5 px-3 rounded-lg border ${chip} hover:brightness-110 focus-visible:ring-2 focus-visible:ring-emerald-500/40`;
    }

    if (variant === 'compact') {
      return `${base} bg-[#0B1F3A]/90 hover:bg-[#132D52] text-slate-200 border border-[#162D4F] hover:border-[#10B981]/50 text-xs font-mono font-medium rounded-lg px-2.5 py-1.5 focus-visible:ring-2 focus-visible:ring-[#10B981]/40 shadow-xs`;
    }

    if (variant === 'dark') {
      const hasErr = Boolean(error);
      return `${base} ${
        hasErr
          ? 'bg-[#0B1F3A] border-rose-500/70 text-white focus-visible:ring-2 focus-visible:ring-rose-500/40'
          : isOpen
          ? 'bg-[#132D52] border-[#10B981] ring-2 ring-[#10B981]/25 text-white shadow-soft'
          : 'bg-[#0B1F3A] hover:bg-[#102747] text-white border border-[#162D4F] hover:border-[#1E3B66] focus-visible:border-[#10B981] focus-visible:ring-2 focus-visible:ring-[#10B981]/20'
      }`;
    }

    // Default: light
    const hasErr = Boolean(error);
    return `${base} ${
      hasErr
        ? 'bg-rose-50/30 border-rose-400 text-slate-900 focus-visible:ring-2 focus-visible:ring-rose-400/20'
        : isOpen
        ? 'bg-white border-[#10B981] ring-2 ring-[#10B981]/20 text-slate-900 shadow-md'
        : 'bg-[#F8FAFC] hover:bg-white text-[#0B1F3A] border border-slate-200 hover:border-slate-300 focus-visible:bg-white focus-visible:border-[#10B981] focus-visible:ring-2 focus-visible:ring-[#10B981]/20 shadow-2xs'
    }`;
  };

  const getMenuClasses = () => {
    if (variant === 'dark' || variant === 'compact' || variant === 'status-badge') {
      return 'bg-[#0B1F3A] border border-[#162D4F] text-slate-100 shadow-2xl shadow-black/60 divide-y divide-[#132D52]';
    }
    return 'bg-white border border-slate-200/90 text-slate-800 shadow-xl shadow-slate-900/10 divide-y divide-slate-100';
  };

  const getOptionClasses = (opt: DropdownOption, isHighlighted: boolean) => {
    const isSelected = opt.value === value;

    if (variant === 'dark' || variant === 'compact' || variant === 'status-badge') {
      return `group relative flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer select-none transition-colors ${
        isSelected
          ? 'bg-[#10B981]/15 text-[#10B981] font-semibold'
          : isHighlighted
          ? 'bg-[#132D52] text-white'
          : 'text-slate-300 hover:bg-[#132D52] hover:text-white'
      }`;
    }

    // Light mode
    return `group relative flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer select-none transition-colors ${
      isSelected
        ? 'bg-[#ECFDF5] text-[#047857] font-semibold'
        : isHighlighted
        ? 'bg-slate-100 text-[#0B1F3A]'
        : 'text-slate-700 hover:bg-slate-50 hover:text-[#0B1F3A]'
    }`;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {label && (
        <label
          htmlFor={dropdownId}
          className={`block text-xs font-bold uppercase tracking-wider font-mono mb-1.5 ${
            variant === 'dark' ? 'text-slate-300' : 'text-[#0B1F3A]'
          }`}
        >
          {label}
        </label>
      )}

      {/* Hidden input for HTML form validation/submission compatibility */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Trigger Button */}
      <button
        ref={buttonRef}
        id={dropdownId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || label || placeholder}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${getTriggerClasses()} ${sizeClasses}`}
      >
        <span className="flex items-center gap-2.5 min-w-0 truncate">
          {LeadingIcon && <span className="shrink-0 text-slate-400 group-hover:text-slate-200">{LeadingIcon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-slate-400 font-normal">{placeholder}</span>}
          </span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0 ml-auto">
          {selectedOption?.badge && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                variant === 'dark' ? 'bg-[#132D52] text-[#10B981]' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ease-out ${
              isOpen ? 'rotate-180 text-[#10B981]' : ''
            }`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Dropdown Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute left-0 right-0 z-50 mt-1.5 rounded-2xl overflow-hidden backdrop-blur-md ${getMenuClasses()} ${menuClassName}`}
            style={{ maxHeight: '280px', display: 'flex', flexDirection: 'column' }}
          >
            {/* Search Input for large lists */}
            {searchable && (
              <div
                className={`p-2 border-b ${
                  variant === 'dark' || variant === 'compact' || variant === 'status-badge'
                    ? 'border-[#162D4F] bg-[#0E2545]'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to filter..."
                    className={`w-full pl-8 pr-7 py-1.5 text-xs rounded-lg font-sans outline-none transition-colors ${
                      variant === 'dark' || variant === 'compact' || variant === 'status-badge'
                        ? 'bg-[#0B1F3A] text-white placeholder-slate-400 border border-[#162D4F] focus:border-[#10B981]'
                        : 'bg-white text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-[#10B981]'
                    }`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 p-0.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Listbox */}
            <ul
              ref={listRef}
              role="listbox"
              tabIndex={-1}
              className="overflow-y-auto overscroll-contain py-1 focus:outline-none divide-y divide-transparent"
              style={{ maxHeight: '220px' }}
            >
              {filteredOptions.length === 0 ? (
                <li
                  className={`px-4 py-4 text-center text-xs ${
                    variant === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  No matching options found
                </li>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isHighlighted = idx === highlightedIndex;

                  return (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(opt.value)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={getOptionClasses(opt, isHighlighted)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 truncate">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <div className="truncate">
                          <div className="flex items-center gap-2 truncate">
                            <span className="truncate">{opt.label}</span>
                            {opt.badge && (
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                  variant === 'dark'
                                    ? 'bg-[#132D52] text-[#10B981]'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          {opt.description && (
                            <p
                              className={`text-[11px] truncate leading-tight mt-0.5 font-normal ${
                                variant === 'dark' ? 'text-slate-400' : 'text-slate-500'
                              }`}
                            >
                              {opt.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="shrink-0 text-[#10B981] ml-2"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </motion.span>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <p className="text-[11px] text-rose-500 font-sans mt-1.5 flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
