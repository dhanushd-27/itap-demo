import type { ChangeEvent } from 'react';

interface PlatformFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlatformFilter({ value, onChange }: PlatformFilterProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className="control">
      <span className="control-label">Platform</span>
      <select className="select" value={value} onChange={handleChange}>
        <option value="all">All Platforms</option>
        <option value="Google Ad Transparency">Google Ad Transparency</option>
        <option value="Meta Ad Library">Meta Ad Library</option>
      </select>
    </label>
  );
}


