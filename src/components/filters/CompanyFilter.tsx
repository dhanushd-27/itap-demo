import type { ChangeEvent } from 'react';

interface CompanyFilterProps {
  value: string;
  onChange: (value: string) => void;
  companies: string[];
}

export function CompanyFilter({ value, onChange, companies }: CompanyFilterProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <label className="control">
      <span className="control-label">Company</span>
      <select className="select" value={value} onChange={handleChange}>
        <option value="all">All Companies</option>
        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>
    </label>
  );
}
