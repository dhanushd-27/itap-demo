import { OrderFilter } from './filters/OrderFilter';
import { LastActiveFilter } from './filters/LastActiveFilter';
import { RunningSinceFilter } from './filters/RunningSinceFilter';
import { CompanyFilter } from './filters/CompanyFilter';
import { FormatFilter } from './filters/FormatFilter';

interface FiltersProps {
  // Order filter
  sortOrder: 'asc' | 'desc';
  onChangeSortOrder: (value: 'asc' | 'desc') => void;
  
  // Last active filter
  lastActiveFilter: string;
  onChangeLastActiveFilter: (value: string) => void;
  
  // Running since filter (campaign duration)
  runningSinceFilter: string;
  onChangeRunningSinceFilter: (value: string) => void;
  
  // Company filter
  companyFilter: string;
  onChangeCompanyFilter: (value: string) => void;
  companies: string[];
  
  // Format filter
  formatFilter: string;
  onChangeFormatFilter: (value: string) => void;
}

export function Filters({
  sortOrder,
  onChangeSortOrder,
  lastActiveFilter,
  onChangeLastActiveFilter,
  runningSinceFilter,
  onChangeRunningSinceFilter,
  companyFilter,
  onChangeCompanyFilter,
  companies,
  formatFilter,
  onChangeFormatFilter,
}: FiltersProps) {
  return (
    <div className="toolbar">
      <OrderFilter value={sortOrder} onChange={onChangeSortOrder} />
      <LastActiveFilter value={lastActiveFilter} onChange={onChangeLastActiveFilter} />
      <RunningSinceFilter value={runningSinceFilter} onChange={onChangeRunningSinceFilter} />
      <CompanyFilter value={companyFilter} onChange={onChangeCompanyFilter} companies={companies} />
      <FormatFilter value={formatFilter} onChange={onChangeFormatFilter} />
    </div>
  );
}

export default Filters;


