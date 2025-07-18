import React, { useState, useRef, useEffect } from 'react';
import { TodoCategory } from './types';
import './CustomDropdown.css';

interface CustomDropdownProps {
  value: TodoCategory;
  onChange: (value: TodoCategory) => void;
  options: TodoCategory[];
  size?: 'normal' | 'small';
  className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  onChange,
  options,
  size = 'normal',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: TodoCategory) => {
    onChange(option);
    setIsOpen(false);
  };

  const getCategoryColor = (category: TodoCategory): string => {
    switch (category) {
      case 'Я должен':
        return '#e74c3c';
      case 'Мне должны':
        return '#3498db';
      case 'Miscellaneous':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div 
      ref={dropdownRef} 
      className={`custom-dropdown ${size === 'small' ? 'small' : ''} ${className}`}
    >
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="dropdown-value">
          <span 
            className="category-dot" 
            style={{ backgroundColor: getCategoryColor(value) }}
          ></span>
          {value}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`dropdown-option ${value === option ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              <span 
                className="category-dot" 
                style={{ backgroundColor: getCategoryColor(option) }}
              ></span>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;