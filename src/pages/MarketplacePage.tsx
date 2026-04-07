import { useState, useEffect, useMemo, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  Search, 
  Filter, 
  Leaf, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  AlertCircle,
  X,
  CheckCircle2
} from "lucide-react";
import { Card, Badge, Button } from "../components/UI";
import { GlowCard } from "../components/GlowCard";
import { loanApi } from "../services/api";
import { LoanApplication } from "../types";
import { formatCurrency, cn } from "../lib/utils";
import { useNotifications } from "../context/NotificationContext";

export function MarketplacePage() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedRisk, setSelectedRisk] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [offerForm, setOfferForm] = useState({ amount: 0, rate: 0, tenure: 0 });
  const [submitting, setSubmitting] = useState(false);
  const { addNotification } = useNotifications();
  const location = useLocation();

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await loanApi.list('submitted');
      setLoans(res);
      setError(null);
      
      // Auto-open modal if loanId is in URL
      const params = new URLSearchParams(location.search);
      const loanId = params.get('loanId');
      if (loanId) {
        const loan = res.find(l => l.id === loanId);
        if (loan) {
          setSelectedLoan(loan);
          setOfferForm({ amount: loan.amount, rate: 12, tenure: 12 });
          setIsModalOpen(true);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const filteredLoans = useMemo(() => {
    if (!Array.isArray(loans)) return [];
    return loans.filter(loan => {
      const matchesSearch = (loan.business_profile?.business_name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === "All" || loan.business_profile?.sector === selectedSector;
      const risk = (loan.risk_score || 0) > 700 ? "Low" : (loan.risk_score || 0) > 500 ? "Medium" : "High";
      const matchesRisk = selectedRisk === "All" || risk === selectedRisk;
      return matchesSearch && matchesSector && matchesRisk;
    });
  }, [loans, searchTerm, selectedSector, selectedRisk]);

  const sectors = useMemo(() => {
    if (!Array.isArray(loans)) return ["All"];
    return ["All", ...new Set(loans.map(l => l.business_profile?.sector).filter(Boolean))];
  }, [loans]);

  const handleMakeOfferClick = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setOfferForm({ amount: loan.amount, rate: 12, tenure: 12 });
    setIsModalOpen(true);
  };

  const handleOfferSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;
    try {
      setSubmitting(true);
      await loanApi.makeOffer({
        loan_id: selectedLoan.id,
        offered_amount: offerForm.amount,
        interest_rate: offerForm.rate,
        tenure_months: offerForm.tenure
      });
      addNotification({
        title: "Offer Submitted!",
        desc: `Your offer for ${selectedLoan.business_profile.business_name} has been sent.`,
        type: 'success'
      });
      setIsModalOpen(false);
      fetchLoans();
    } catch (err: any) {
      addNotification({
        title: "Offer Failed",
        desc: err.message,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-rose-500/50 bg-rose-500/5 p-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
        <h2 className="mb-2 text-xl font-bold text-app-text">Marketplace Unavailable</h2>
        <p className="mb-6 text-slate-muted">{error}</p>
        <Button onClick={fetchLoans}>Retry Connection</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-slate-soft">Marketplace</h1>
        <Badge variant="outline" className="border-indigo-primary/30 text-indigo-primary">
          <Zap className="mr-2 h-4 w-4" />
          {loans.length} Active Opportunities
        </Badge>
      </div>

      {/* Filter Bar */}
      <GlowCard className="border-none bg-app-bg/40 backdrop-blur-xl p-6" glowColor="rgba(99, 102, 241, 0.2)">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <input
              type="text"
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-xl bg-white/5 pl-10 pr-4 text-sm text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
            />
          </div>
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="h-10 w-full rounded-xl bg-white/5 px-4 text-sm text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
          >
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="h-10 w-full rounded-xl bg-white/5 px-4 text-sm text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>
      </GlowCard>

      {/* Card Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => {
            const risk = loan.risk_score > 700 ? "Low" : loan.risk_score > 500 ? "Medium" : "High";
            return (
              <GlowCard key={loan.id} className="flex flex-col border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(99, 102, 241, 0.3)">
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-app-text">{loan.business_profile.business_name}</h3>
                    <p className="text-xs text-app-muted uppercase tracking-widest">{loan.business_profile.sector}</p>
                  </div>
                  <Badge variant={risk === 'Low' ? 'success' : risk === 'Medium' ? 'warning' : 'error'}>
                    {risk} Risk
                  </Badge>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted">Requested</p>
                    <p className="text-lg font-black text-app-text">{formatCurrency(loan.amount)}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted">ESG Score</p>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-emerald-400" />
                      <p className="text-lg font-black text-emerald-400">{loan.risk_score}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center justify-between text-xs text-app-muted">
                    <span>Purpose: {loan.purpose}</span>
                    <span>{new Date(loan.created_at).toLocaleDateString()}</span>
                  </div>
                  <Button className="w-full" onClick={() => handleMakeOfferClick(loan)}>
                    Make Offer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </GlowCard>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
            <Globe className="mx-auto mb-4 h-12 w-12 text-slate-muted" />
            <h3 className="text-xl font-bold text-app-text">No opportunities found</h3>
            <p className="text-slate-muted">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>

      {/* Make Offer Modal */}
      <AnimatePresence>
        {isModalOpen && selectedLoan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-border-subtle bg-app-bg p-8 shadow-2xl"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 text-slate-muted hover:text-app-text"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="mb-2 text-2xl font-bold text-app-text">Make Loan Offer</h2>
              <p className="mb-8 text-sm text-slate-muted">
                Submit your terms for <span className="font-bold text-indigo-primary">{selectedLoan.business_profile.business_name}</span>
              </p>

              <form onSubmit={handleOfferSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-app-muted">Offered Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={offerForm.amount}
                    onChange={(e) => setOfferForm({ ...offerForm, amount: Number(e.target.value) })}
                    className="h-12 w-full rounded-xl bg-white/5 px-4 text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-app-muted">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={offerForm.rate}
                      onChange={(e) => setOfferForm({ ...offerForm, rate: Number(e.target.value) })}
                      className="h-12 w-full rounded-xl bg-white/5 px-4 text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-app-muted">Tenure (Months)</label>
                    <input
                      type="number"
                      required
                      value={offerForm.tenure}
                      onChange={(e) => setOfferForm({ ...offerForm, tenure: Number(e.target.value) })}
                      className="h-12 w-full rounded-xl bg-white/5 px-4 text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full h-12 text-lg" disabled={submitting}>
                    {submitting ? "Submitting..." : "Send Offer"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
