import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data Store
  let esgMetrics = {
    renewableEnergyPercent: 0,
    carbonIntensity: 0,
    wasteRecycledPercent: 0,
    socialImpactScore: 0,
  };

  let userProfile = {
    name: "Angelina Nathala",
    businessName: "Nathala Eco Solutions",
    email: "nathalaangelina@gmail.com",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    role: "BORROWER", // or "LENDER"
    verified: true,
  };

  let auditLogs = [
    {
      id: "1",
      event: "Loan Application Submitted",
      timestamp: new Date().toISOString(),
      details: "Application for ₹10,00,000 submitted by Nathala Eco Solutions.",
      hash: "0x7d2f...e4a1",
      prevHash: "0x0000...0000",
    },
  ];

  let offers = [
    {
      id: "offer_1",
      lenderName: "HDFC Bank",
      lenderLogo: "https://picsum.photos/seed/hdfc/100/100",
      interestRate: 9.5,
      creditLimit: 1000000,
      tenureMonths: 24,
      esgAdjustment: -0.5,
      status: "PENDING",
    },
    {
      id: "offer_2",
      lenderName: "ICICI Bank",
      lenderLogo: "https://picsum.photos/seed/icici/100/100",
      interestRate: 10.2,
      creditLimit: 1500000,
      tenureMonths: 36,
      esgAdjustment: -0.3,
      status: "PENDING",
    },
  ];

  // API Routes
  app.get("/api/dashboard/borrower", (req, res) => {
    res.json({
      profile: userProfile,
      esg: esgMetrics,
      offers: offers,
      repayments: [],
      opportunities: [],
    });
  });

  app.get("/api/dashboard/lender", (req, res) => {
    res.json({
      profile: userProfile,
      portfolio_value: 5000000,
      active_loans: 12,
      avg_yield: 10.5,
      offers: [],
    });
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
        details: `Offer from ${offer.lenderName} for ₹${offer.creditLimit} accepted.`,
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
      total_invested: 5000000,
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
