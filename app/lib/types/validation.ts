import type { MinimalUser, MinimalWorkspace } from './common';

export type ProductType = 'dataset' | 'report' | 'dashboard';
export type ValidationStatus =
  | 'pending'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'rejected';

export interface AutomatedCheck {
  key: string;
  label: string;
  passed: boolean;
  required: boolean;
  detail: string;
}

export interface ProductValidation {
  id: string;
  product_type: ProductType;
  object_id: string;
  product: {
    id: string;
    title: string;
    status: string;
    verification_status: string;
    owner: MinimalUser | null;
    workspace: MinimalWorkspace | null;
  } | null;
  status: ValidationStatus;
  automated_checks: AutomatedCheck[];
  automated_score: number;
  automated_passed: boolean;
  manual_checklist: Record<string, boolean>;
  reviewer_notes: string;
  submitted_by: MinimalUser | null;
  reviewer: MinimalUser | null;
  submission_count: number;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface ValidationDecisionInput {
  decision: 'approved' | 'changes_requested' | 'rejected';
  manual_checklist: Record<string, boolean>;
  reviewer_notes: string;
  override_automated_checks: boolean;
}
