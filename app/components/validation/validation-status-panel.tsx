import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { ProductValidation } from '~/lib/types/validation';

interface Props {
  verificationStatus: string;
  validation?: ProductValidation | null;
  validationRequired?: boolean;
}

const approved = new Set(['AP', 'approved']);
const rejected = new Set(['RE', 'rejected']);
const changes = new Set(['CR', 'changes_requested']);

export function ValidationStatusPanel({
  verificationStatus,
  validation,
  validationRequired = true,
}: Readonly<Props>) {
  const isApproved = approved.has(verificationStatus);
  const isRejected = rejected.has(verificationStatus);
  const needsChanges = changes.has(verificationStatus);
  const Icon = isApproved
    ? CheckCircle2
    : isRejected
      ? XCircle
      : needsChanges
        ? AlertTriangle
        : Clock3;
  const title = isApproved
    ? validationRequired
      ? 'Approved for public access'
      : 'Published by Datawise Africa'
    : isRejected
      ? 'Publication rejected'
      : needsChanges
        ? 'Changes requested'
        : verificationStatus === 'IR' || verificationStatus === 'in_review'
          ? 'Admin review in progress'
          : 'Waiting for admin review';

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">
            {isApproved && !validationRequired
              ? 'Internal workspace products publish directly without external-creator review.'
              : isApproved
                ? 'This product can appear on public pages.'
                : 'It remains private to its creator and workspace until approved.'}
          </p>
          {validation?.reviewer_notes && (
            <p className="pt-2 text-sm">
              <strong>Reviewer notes:</strong> {validation.reviewer_notes}
            </p>
          )}
          {validation && (
            <p className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Automated score:{' '}
              {validation.automated_score}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
