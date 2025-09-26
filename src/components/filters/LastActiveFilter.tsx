import type { ChangeEvent } from 'react';

interface LastActiveFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function LastActiveFilter({ value, onChange }: LastActiveFilterProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className="control">
      <span className="control-label">Last Active</span>
      <select className="select" value={value} onChange={handleChange}>
        <option value="all">All</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="quarter">This Quarter</option>
      </select>
    </label>
  );
}
