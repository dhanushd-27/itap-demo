import type { ChangeEvent } from 'react';

interface FormatFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function FormatFilter({ value, onChange }: FormatFilterProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className="control">
      <span className="control-label">Format</span>
      <select className="select" value={value} onChange={handleChange}>
        <option value="all">All Formats</option>
        <option value="Image">Image</option>
        <option value="Video">Video</option>
      </select>
    </label>
  );
}
