import express from "express";

const app = express();
app.use(express.json());

// Mock Data Store
let esgMetrics = {
  renewableEnergyPercent: 82,
  carbonIntensity: 14,
  wasteRecycledPercent: 65,
  socialImpactScore: 88,
  complianceScore: 94,
};

let userProfile = {
  name: "Angelina Nathala",
  businessName: "Nathala Eco Solutions",
  email: "nathalaangelina@gmail.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  role: "LENDER", 
  verified: true,
};

let auditLogs = [
  {
    id: "log_1",
    event: "Loan Application Submitted",
    timestamp: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    details: "Application for ₹10,00,000 submitted by Nathala Eco Solutions.",
    hash: "0x7d2f4a1e9c8b",
    prevHash: "0x000000000000",
  },
  {
    id: "log_2",
    event: "ESG Data Verified",
    timestamp: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    details: "ESG metrics for Nathala Eco Solutions verified via GreenFlow Oracle.",
    hash: "0x8e3g5b2h1j4k",
    prevHash: "0x7d2f4a1e9c8b",
  }
];

let offers = [
  {
    id: "offer_1",
    loan_id: "loan_7d2f4a",
    business_name: "Eco-Friendly Packaging",
    offered_amount: 1000000,
    interest_rate: 9.5,
    tenure_months: 24,
    status: "ACTIVE",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    risk_score: 820,
  },
  {
    id: "offer_2",
    loan_id: "loan_8e3g5b",
    business_name: "Solar Grid Solutions",
    offered_amount: 1500000,
    interest_rate: 10.2,
    tenure_months: 36,
    status: "ACTIVE",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    risk_score: 895,
  },
];

let loanApplications = [
  {
    id: "loan_7d2f4a",
    borrower_id: "u_borrower1",
    amount: 1000000,
    purpose: "Solar Panel Installation",
    status: "funded",
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    business_profile: {
      business_name: "Eco-Friendly Packaging",
      sector: "Manufacturing",
    },
    risk_score: 820,
  },
  {
    id: "loan_abc123",
    borrower_id: "u_borrower2",
    amount: 500000,
    purpose: "Sustainable Agriculture Equipment",
    status: "submitted",
    created_at: new Date().toISOString(),
    business_profile: {
      business_name: "Green Farm Tech",
      sector: "Agriculture",
    },
    risk_score: 745,
  }
];

// API Routes
app.get("/api/dashboard/borrower", (req, res) => {
  res.json({
    total_borrowed: 2500000,
    total_approved: 2500000,
    total_repaid: 350000,
    outstanding_balance: 2150000,
    next_emi_date: "2026-05-01T10:00:00Z",
    next_emi_amount: 25000,
    loans: loanApplications.filter(l => l.borrower_id === "u_borrower1"),
  });
});

app.get("/api/dashboard/lender", (req, res) => {
  res.json({
    offer_count: offers.length,
    accepted_offer_count: offers.length,
    portfolio_value: offers.reduce((sum, o) => sum + o.offered_amount, 0),
    average_interest_rate: 9.85,
    offers: offers,
  });
});

app.get("/api/loans", (req, res) => {
  const { status } = req.query;
  if (status) {
    return res.json(loanApplications.filter(l => l.status === status));
  }
  res.json(loanApplications);
});

app.get("/api/esg/portfolio-avg", (req, res) => {
  res.json({ score: 865 });
});

app.get("/api/esg/:loanId", (req, res) => {
  res.json({ score: Math.floor(Math.random() * 200) + 700 });
});

app.post("/api/offers", (req, res) => {
  const newOffer = {
    id: `offer_${Math.random().toString(36).substring(7)}`,
    ...req.body,
    status: "PENDING",
    created_at: new Date().toISOString(),
    business_name: "New SME Applicant",
    risk_score: 750
  };
  offers.push(newOffer);
  res.json(newOffer);
});

app.patch("/api/offers/:offerId/accept", (req, res) => {
  const { offerId } = req.params;
  const offer = offers.find((o) => o.id === offerId);
  if (offer) {
    offer.status = "ACCEPTED";
    auditLogs.unshift({
      id: Math.random().toString(36).substring(7),
      event: "Offer Accepted",
      timestamp: new Date().toISOString(),
      details: `Offer for ₹${offer.offered_amount} accepted for ${offer.business_name}.`,
      hash: "0x" + Math.random().toString(16).substring(2, 10),
      prevHash: auditLogs[0]?.hash || "0x0000",
    });
    res.json({ message: "Offer accepted successfully", offer });
  } else {
    res.status(404).json({ message: "Offer not found" });
  }
});

app.put("/api/esg/metrics", (req, res) => {
  esgMetrics = { ...esgMetrics, ...req.body };
  auditLogs.unshift({
    id: Math.random().toString(36).substring(7),
    event: "ESG Metrics Updated",
    timestamp: new Date().toISOString(),
    details: "User updated their ESG metrics manually.",
    hash: "0x" + Math.random().toString(16).substring(2, 10),
    prevHash: auditLogs[0]?.hash || "0x0000",
  });
  res.json({ message: "ESG metrics updated", metrics: esgMetrics });
});

app.get("/api/profile/me", (req, res) => {
  res.json(userProfile);
});

app.put("/api/profile/me", (req, res) => {
  userProfile = { ...userProfile, ...req.body };
  res.json({ message: "Profile updated", profile: userProfile });
});

app.post("/api/profile/request-verification", (req, res) => {
  res.json({ message: "Verification request submitted" });
});

app.get("/api/receipts/:transactionId", (req, res) => {
  res.json({
    transactionId: req.params.transactionId,
    amount: 5000,
    date: new Date().toISOString(),
    status: "SUCCESS",
    lender: "HDFC Bank",
  });
});

app.get("/api/portfolio/analytics", (req, res) => {
  res.json({
    total_invested: offers.reduce((sum, o) => sum + o.offered_amount, 0),
    total_returns: 525000,
    avg_esg_score: 845,
    sector_distribution: [
      { name: "Renewable Energy", value: 40 },
      { name: "Agriculture", value: 30 },
      { name: "Manufacturing", value: 20 },
      { name: "Retail", value: 10 },
    ],
  });
});

app.get("/api/lenders/smes", (req, res) => {
  res.json([
    {
      id: "sme_1",
      name: "Eco-Friendly Packaging",
      sector: "Manufacturing",
      esg_score: 890,
      requested_amount: 2000000,
      risk_grade: "A+",
    },
    {
      id: "sme_2",
      name: "Solar Grid Solutions",
      sector: "Energy",
      esg_score: 920,
      requested_amount: 5000000,
      risk_grade: "AA",
    },
  ]);
});

app.get("/api/repayments/schedule", (req, res) => {
  res.json([
    { id: "tr_1", date: "2026-03-01T10:00:00Z", amount: 25000, status: "PAID", type: "ECS Auto-debit" },
    { id: "tr_2", date: "2026-04-01T10:00:00Z", amount: 25000, status: "PAID", type: "ECS Auto-debit" },
    { id: "tr_3", date: "2026-05-01T10:00:00Z", amount: 25000, status: "PENDING", type: "ECS Auto-debit" },
  ]);
});

app.get("/api/audit-logs", (req, res) => {
  res.json(auditLogs);
});

export default app;
