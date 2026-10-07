export interface DocumentAnalysisData {
  filename: string;
  size_bytes: number;
  page_count: number;
  page_dimension?: string;
  pdf_version: string;
  is_encrypted: boolean;
  is_readable: boolean;
  metadata: {
    title?: string;
    author?: string;
    creator?: string;
    producer?: string;
    creation_date?: string;
    modification_date?: string;
  };
  has_metadata: boolean;
  file_base64: string;
  loaded_at: string;
}

export interface VerificationChecks {
  output_exists: boolean;
  pdf_readable: boolean;
  page_count_preserved: boolean;
  protection_applied: boolean;
}

export interface ProtectionResult {
  output_filename: string;
  input_filename: string;
  file_size: number;
  protected_base64: string;
  page_count: number;
  timestamp: string;
  verification_checks: VerificationChecks;
}

export interface HistoryRecord {
  id: string;
  document_name: string;
  output_name: string;
  action: 'Protected' | 'Verified';
  original_size: number;
  protected_size?: number;
  page_count: number;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
}

export type WorkstationView =
  | 'protect'
  | 'verify'
  | 'doc-info'
  | 'security-details'
  | 'history'
  | 'how-it-works'
  | 'security-notes';
