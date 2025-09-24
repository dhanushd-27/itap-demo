import type { ChangeEvent } from 'react';

interface FiltersProps {
  minActiveFilter: string;
  sortOrder: 'asc' | 'desc';
  onChangeMinActiveFilter: (value: string) => void;
  onChangeSortOrder: (value: 'asc' | 'desc') => void;
}

export function Filters({
  minActiveFilter,
  sortOrder,
  onChangeMinActiveFilter,
  onChangeSortOrder,
}: FiltersProps) {
  const handleActiveChange = (e: ChangeEvent<HTMLSelectElement>) => onChangeMinActiveFilter(e.target.value);
  const handleOrderChange = (e: ChangeEvent<HTMLSelectElement>) => onChangeSortOrder(e.target.value as 'asc' | 'desc');

  return (
    <div className="toolbar">
      <label className="control">
        <span className="control-label">Active from</span>
        <select className="select" value={minActiveFilter} onChange={handleActiveChange}>
          <option value="all">All</option>
          <option value="lt7">Less than 7 days</option>
          <option value="7to29">7–29 days (weeks)</option>
          <option value="gte30">30+ days (months)</option>
        </select>
      </label>
      <label className="control">
        <span className="control-label">Order</span>
        <select className="select" value={sortOrder} onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
}

export default Filters;


