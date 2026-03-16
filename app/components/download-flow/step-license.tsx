import { Label } from '~/components/ui/label';

interface StepLicenseProps {
  licenseTitle: string;
  acceptedTerms: boolean;
  acceptedLicense: boolean;
  onAcceptTerms: (val: boolean) => void;
  onAcceptLicense: (val: boolean) => void;
}

export function StepLicense({
  licenseTitle,
  acceptedTerms,
  acceptedLicense,
  onAcceptTerms,
  onAcceptLicense,
}: StepLicenseProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <h4 className="mb-2 font-medium">License: {licenseTitle}</h4>
        <p className="text-sm text-muted-foreground">
          By downloading this dataset, you agree to comply with the terms of the{' '}
          {licenseTitle} license. This includes restrictions on redistribution,
          commercial use, and attribution requirements as specified by the
          dataset creator.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => onAcceptTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">
            I agree to the terms and conditions of this dataset, including data
            accuracy, responsible use, and privacy compliance.
          </span>
        </Label>

        <Label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedLicense}
            onChange={(e) => onAcceptLicense(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm">
            I accept the {licenseTitle} license agreement and will use this
            dataset in accordance with its terms.
          </span>
        </Label>
      </div>
    </div>
  );
}
