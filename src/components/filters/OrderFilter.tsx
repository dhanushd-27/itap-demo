import type { ChangeEvent } from 'react';

interface OrderFilterProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
}

export function OrderFilter({ value, onChange }: OrderFilterProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as 'asc' | 'desc');
  };

  return (
    <label className="control">
      <span className="control-label">Sort By</span>
      <select className="select" value={value} onChange={handleChange}>
        <option value="desc">Recent First</option>
        <option value="asc">Oldest First</option>
      </select>
    </label>
  );
}
