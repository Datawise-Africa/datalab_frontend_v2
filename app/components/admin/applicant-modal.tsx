import moment from 'moment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import {
  User,
  Building2,
  Briefcase,
  MessageSquare,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import type { BecomeDatasetCreatorType } from '~/lib/types/dataset-creator';
import { getDatasetCreatorBadge } from '~/lib/types/dataset-creator';

interface ApplicantModalProps {
  application: BecomeDatasetCreatorType | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const statusIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  pending: Clock,
  in_review: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export function ApplicantModal({
  application,
  open,
  onClose,
  onApprove,
  onReject,
}: ApplicantModalProps) {
  if (!application) return null;

  const badge = getDatasetCreatorBadge(application.status);
  const StatusIcon = statusIcons[application.status] ?? Clock;
  const isPending =
    application.status === 'pending' || application.status === 'in_review';
  const isApproved = application.status === 'approved';
  const isRejected = application.status === 'rejected';

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>Review this creator application</DialogDescription>
        </DialogHeader>

        {/* ── Applicant header ── */}
        <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base">{application.user_name}</p>
          </div>
          <Badge className={`shrink-0 gap-1.5 ${badge.className}`}>
            <StatusIcon className="h-3.5 w-3.5" />
            {badge.label}
          </Badge>
        </div>

        <Separator />

        {/* ── Details grid ── */}
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem
            icon={Building2}
            label="Affiliation"
            value={application.affiliation}
          />
          <DetailItem
            icon={Briefcase}
            label="Expertise"
            value={application.expertise}
          />
          <DetailItem
            icon={Calendar}
            label="Applied"
            value={moment(application.created_at).format('MMM D, YYYY')}
          />
          {application.approved_at && (
            <DetailItem
              icon={CheckCircle}
              label="Approved"
              value={moment(application.approved_at).format('MMM D, YYYY')}
            />
          )}
        </div>

        {/* ── Reason ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Reason for Joining</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed rounded-lg bg-muted/30 p-3">
            {application.reason_for_joining}
          </p>
        </div>

        {/* ── Past work files ── */}
        {/* {application.past_work_files.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                Past Work ({application.past_work_files.length} file
                {application.past_work_files.length !== 1 ? 's' : ''})
              </p>
            </div>
            <div className="space-y-2">
              {application.past_work_files.map((file) => (
                <a
                  key={file.id}
                  href={file.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 truncate">Attachment {file.id}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )} */}

        <Separator />

        {/* ── Actions ── */}
        <div className="flex gap-2">
          {isPending && (
            <>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => {
                  onApprove(application.id);
                  onClose();
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  onReject(application.id);
                  onClose();
                }}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          {isApproved && (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                onReject(application.id);
                onClose();
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Revoke Approval
            </Button>
          )}
          {isRejected && (
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => {
                onApprove(application.id);
                onClose();
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Reconsider &amp; Approve
            </Button>
          )}
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
