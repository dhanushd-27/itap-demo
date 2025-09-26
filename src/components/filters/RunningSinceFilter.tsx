import type { ChangeEvent } from 'react';

interface RunningSinceFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function RunningSinceFilter({ value, onChange }: RunningSinceFilterProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className="control">
      <span className="control-label">Running Since</span>
      <select className="select" value={value} onChange={handleChange}>
        <option value="all">All</option>
        <option value="lt7">Less than 7 days</option>
        <option value="7to29">7–29 days (weeks)</option>
        <option value="gte30">30+ days (months)</option>
        <option value="gte90">90+ days (quarters)</option>
        <option value="gte365">1+ years</option>
      </select>
    </label>
  );
}
