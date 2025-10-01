import type { ChangeEvent } from 'react';

const RUNNING_SINCE_OPTIONS: Array<{ value: 'asc' | 'desc'; label: string }> = [
  { value: 'asc', label: 'Recent First' },
  { value: 'desc', label: 'Old First' },
];

interface RunningSinceFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function RunningSinceFilter({ value, onChange }: RunningSinceFilterProps) {
  return (
    <label className="control">
      <span className="control-label">Running Since</span>
      <select
        className="select"
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      >
        {RUNNING_SINCE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
