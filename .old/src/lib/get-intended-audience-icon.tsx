import { Building, Check, Globe, GraduationCap, Users, X } from 'lucide-react';
import type { IDataset } from './types/data-set';

export function getIntendedAudienceIcon({
  company,
  non_profit,
  students,
  public: pb,
}: IDataset['intended_audience']) {
  const spanClasses = 'text-[10px]';
  const iconClasses = 'h-3 w-3';
  const wrapperClasses =
    'flex items-center gap-1 text-gray-500 dark:text-gray-400 border border-[0.8px] border-primary/10 rounded px-1 py-1';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {company ? (
        <div className={wrapperClasses}>
          <Building className={iconClasses} />{' '}
          <span className={spanClasses}>Company</span>{' '}
          <Check className={iconClasses + ' text-green-500'} />
        </div>
      ) : (
        <div className={wrapperClasses}>
          {' '}
          <Building className={iconClasses} />{' '}
          <span className={spanClasses}>Company</span>{' '}
          <X className={iconClasses + ' text-red-500'} />
        </div>
      )}
      {non_profit ? (
        <div className={wrapperClasses}>
          <Users className={iconClasses} />{' '}
          <span className={spanClasses}>Non-Profit</span>{' '}
          <Check className={iconClasses + ' text-green-500'} />
        </div>
      ) : (
        <div className={wrapperClasses}>
          <Users className={iconClasses} />{' '}
          <span className={spanClasses}>Non-Profit</span>{' '}
          <X className={iconClasses + ' text-red-500'} />
        </div>
      )}
      {students ? (
        <div className={wrapperClasses}>
          <GraduationCap className={iconClasses} />{' '}
          <span className={spanClasses}>Students</span>{' '}
          <Check className={iconClasses + ' text-green-500'} />
        </div>
      ) : (
        <div className={wrapperClasses}>
          <GraduationCap className={iconClasses} />{' '}
          <span className={spanClasses}>Students</span>{' '}
          <X className={iconClasses + ' text-red-500'} />
        </div>
      )}
      {pb ? (
        <div className={wrapperClasses}>
          <Globe className={iconClasses} />{' '}
          <span className={spanClasses}>Public</span>{' '}
          <Check className={iconClasses + ' text-green-500'} />
        </div>
      ) : (
        <div className={wrapperClasses}>
          <Globe className={iconClasses} />{' '}
          <span className={spanClasses}>Public</span>{' '}
          <X className={iconClasses + ' text-red-500'} />
        </div>
      )}
    </div>
  );
}
