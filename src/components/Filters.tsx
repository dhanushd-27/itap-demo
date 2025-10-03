import { LastActiveFilter } from './filters/LastActiveFilter';
import { RunningSinceFilter } from './filters/RunningSinceFilter';
import { CompanyFilter } from './filters/CompanyFilter';
import { FormatFilter } from './filters/FormatFilter';
import { PlatformFilter } from './filters/PlatformFilter';

interface FiltersProps {
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

  // Platform filter
  platformFilter: string;
  onChangePlatformFilter: (value: string) => void;
}

export function Filters({
  lastActiveFilter,
  onChangeLastActiveFilter,
  runningSinceFilter,
  onChangeRunningSinceFilter,
  companyFilter,
  onChangeCompanyFilter,
  companies,
  formatFilter,
  onChangeFormatFilter,
  platformFilter,
  onChangePlatformFilter,
}: FiltersProps) {
  return (
    <div className="toolbar">
      <LastActiveFilter value={lastActiveFilter} onChange={onChangeLastActiveFilter} />
      <RunningSinceFilter value={runningSinceFilter} onChange={onChangeRunningSinceFilter} />
      <CompanyFilter value={companyFilter} onChange={onChangeCompanyFilter} companies={companies} />
      <FormatFilter value={formatFilter} onChange={onChangeFormatFilter} />
      <PlatformFilter value={platformFilter} onChange={onChangePlatformFilter} />
    </div>
  );
}

export default Filters;


