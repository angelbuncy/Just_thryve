export type LoanStatus = "CREATED" | "ACTIVE" | "CLOSED" | "PENDING";

export interface LoanOffer {
  id: string;
  lenderName: string;
  lenderLogo: string;
  interestRate: number;
  creditLimit: number;
  tenureMonths: number;
  esgAdjustment: number;
}

export interface ESGMetrics {
  renewableEnergyPercent: number;
  carbonIntensity: number;
  complianceScore: number;
  wasteRecycledPercent: number;
  socialImpactScore: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  hash: string;
  prevHash: string;
  details: string;
  isTampered?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "BORROWER" | "LENDER";
  businessName?: string;
}

export interface LoanApplication {
  id: string;
  borrower_id: string;
  amount: number;
  purpose: string;
  status: "submitted" | "approved" | "rejected" | "funded";
  created_at: string;
  business_profile: {
    business_name: string;
    sector: string;
  };
  risk_score: number;
}

export interface LenderDashboardResponse {
  offer_count: number;
  accepted_offer_count: number;
  portfolio_value: number;
  average_interest_rate: number;
  offers: Array<{
    id: string;
    loan_id: string;
    offered_amount: number;
    interest_rate: number;
    tenure_months: number;
    status: string;
    created_at: string;
    business_name: string;
    risk_score: number;
  }>;
}

export interface BorrowerDashboardResponse {
  total_borrowed: number;
  outstanding_balance: number;
  next_emi_date: string;
  next_emi_amount: number;
  loans: any[];
}
