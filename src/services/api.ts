import { 
  LenderDashboardResponse, 
  BorrowerDashboardResponse, 
  LoanApplication 
} from "../types";

const API_BASE_URL = "/api"; // Assuming proxy or base URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const error = await response.json();
      errorMessage = error.message || error.detail || response.statusText;
    } catch (e) {
      // If not JSON, try to get text
      try {
        const text = await response.text();
        if (text && text.length < 200) errorMessage = text;
      } catch (e2) {}
    }
    throw new Error(errorMessage || "Something went wrong");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {} as T;
}

export const dashboardApi = {
  lender: () => request<LenderDashboardResponse>('/dashboard/lender'),
  borrower: () => request<BorrowerDashboardResponse>('/dashboard/borrower'),
};

export const loanApi = {
  list: (status?: string) => request<LoanApplication[]>(`/loans${status ? `?status=${status}` : ''}`),
  getESG: (loanId: string) => request<{ score: number }>(`/esg/${loanId}`),
  getPortfolioAvgESG: () => request<{ score: number }>('/esg/portfolio-avg'),
  makeOffer: (data: { loan_id: string; offered_amount: number; interest_rate: number; tenure_months: number }) => 
    request('/offers', { method: 'POST', body: JSON.stringify(data) }),
  acceptOffer: (offerId: string) => 
    request(`/offers/${offerId}/accept`, { method: 'PATCH' }),
};

export const esgApi = {
  updateMetrics: (data: any) => request('/esg/metrics', { method: 'PUT', body: JSON.stringify(data) }),
};

export const profileApi = {
  getMe: () => request<any>('/profile/me'),
  updateMe: (data: any) => request('/profile/me', { method: 'PUT', body: JSON.stringify(data) }),
  requestVerification: (data: any) => request('/profile/request-verification', { method: 'POST', body: data }), // data might be FormData
};

export const repaymentApi = {
  getSchedule: () => request<any[]>('/repayments/schedule'),
};

export const receiptApi = {
  get: (transactionId: string) => request<any>(`/receipts/${transactionId}`),
};

export const portfolioApi = {
  getAnalytics: (params?: any) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/portfolio/analytics${query}`);
  },
};

export const lenderApi = {
  getSMEs: (params?: any) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/lenders/smes${query}`);
  },
};
