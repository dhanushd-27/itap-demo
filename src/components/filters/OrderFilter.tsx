import type { ChangeEvent } from 'react';

const ORDER_OPTIONS: Array<{ value: 'asc' | 'desc'; label: string }> = [
  { value: 'desc', label: 'Recent First' },
  { value: 'asc', label: 'Old First' },
];

interface OrderFilterProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
}

export function OrderFilter({ value, onChange }: OrderFilterProps) {
  return (
    <label className="control">
      <span className="control-label">Sort By</span>
      <select
        className="select"
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as 'asc' | 'desc')}
      >
        {ORDER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
