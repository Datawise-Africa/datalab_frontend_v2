import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { AsyncSelect } from '~/components/ui/async-select';

export interface OverviewData {
  intendedUse: string;
  projectDescription: string;
  institutionType: string;
}

interface StepOverviewProps {
  data: OverviewData;
  onChange: (data: OverviewData) => void;
}

const institutionTypes = [
  { label: 'Company', value: 'company' },
  { label: 'Non-Profit', value: 'non_profit' },
  { label: 'Student / Academic', value: 'students' },
  { label: 'Public / Individual', value: 'public' },
];

export function StepOverview({ data, onChange }: StepOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="intended-use">Intended Use</Label>
        <Input
          id="intended-use"
          placeholder="e.g., Research, Analysis, Machine Learning"
          value={data.intendedUse}
          onChange={(e) => onChange({ ...data, intendedUse: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-desc">Project Description</Label>
        <Textarea
          id="project-desc"
          placeholder="Briefly describe your project and how you plan to use this dataset..."
          rows={3}
          value={data.projectDescription}
          onChange={(e) =>
            onChange({ ...data, projectDescription: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Institution Type</Label>
        <AsyncSelect
          value={data.institutionType || null}
          onChange={(val) => onChange({ ...data, institutionType: val ?? '' })}
          options={institutionTypes}
          placeholder="Select your institution type"
        />
      </div>
    </div>
  );
}
