import { useState, useEffect, useMemo, FormEvent } from "react";
import { motion } from "motion/react";
import { 
  CreditCard, 
  ArrowRight, 
  AlertCircle, 
  History, 
  Wallet,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Card, Badge, Button } from "../components/UI";
import { GlowCard } from "../components/GlowCard";
import { dashboardApi } from "../services/api";
import { LenderDashboardResponse } from "../types";
import { formatCurrency, cn } from "../lib/utils";
import { useNotifications } from "../context/NotificationContext";

export function WithdrawalsPage() {
  const [data, setData] = useState<LenderDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addNotification } = useNotifications();

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.lender();
      setData(res);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableToWithdraw = useMemo(() => {
    if (!data || !Array.isArray(data.offers)) return 0;
    const totalDeployed = data.offers.reduce((acc, curr) => acc + (curr.offered_amount || 0), 0);
    return Math.max(0, (data.portfolio_value || 0) - totalDeployed);
  }, [data]);

  const handleWithdraw = async (e: FormEvent) => {
    e.preventDefault();
    if (Number(amount) > availableToWithdraw) {
      addNotification({
        title: "Invalid Amount",
        desc: "You cannot withdraw more than your available balance.",
        type: 'error'
      });
      return;
    }
    
    try {
      setSubmitting(true);
      // Stub for withdrawal request
      await new Promise(resolve => setTimeout(resolve, 1500));
      addNotification({
        title: "Withdrawal Requested!",
        desc: `Your request for ${formatCurrency(Number(amount))} is being processed.`,
        type: 'success'
      });
      setAmount("");
    } catch (err: any) {
      addNotification({
        title: "Request Failed",
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
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
          <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-rose-500/50 bg-rose-500/5 p-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
        <h2 className="mb-2 text-xl font-bold text-app-text">Failed to load balance</h2>
        <p className="mb-6 text-slate-muted">{error}</p>
        <Button onClick={fetchData}>Retry Connection</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-slate-soft">Withdrawals</h1>
        <Badge variant="outline" className="border-indigo-primary/30 text-indigo-primary">
          <Wallet className="mr-2 h-4 w-4" />
          Instant Settlements Active
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Withdrawal Form */}
        <GlowCard className="border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(99, 102, 241, 0.3)">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-app-muted mb-2">Available to Withdraw</p>
            <h2 className="text-5xl font-black text-app-text tracking-tighter">{formatCurrency(availableToWithdraw)}</h2>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-app-muted">Withdrawal Amount (₹)</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-muted" />
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-14 w-full rounded-2xl bg-white/5 pl-12 pr-4 text-lg text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
                />
              </div>
              <p className="text-[10px] text-slate-muted">Funds will be credited to your linked bank account within 24-48 hours.</p>
            </div>

            <Button className="w-full h-14 text-lg" disabled={submitting || !amount || Number(amount) <= 0}>
              {submitting ? "Processing..." : "Request Withdrawal"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </GlowCard>

        {/* Withdrawal History */}
        <GlowCard className="flex flex-col border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(99, 102, 241, 0.3)">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-indigo-primary" />
              <h3 className="text-xl font-bold text-app-text">Past Withdrawals</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <History className="h-10 w-10 text-slate-muted/30" />
            </div>
            <h4 className="mb-2 font-bold text-app-text">No withdrawal history</h4>
            <p className="text-xs text-slate-muted max-w-[240px]">Once you make your first withdrawal, it will appear here for your records.</p>
          </div>

          {/* Example of how it would look with data */}
          {/* <div className="space-y-4">
            {[
              { id: '1', date: 'Mar 12, 2026', amount: '₹50,000', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-400' },
              { id: '2', date: 'Feb 28, 2026', amount: '₹1,20,000', status: 'Pending', icon: Clock, color: 'text-amber-400' },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-border-subtle">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <item.icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-app-text">{item.date}</p>
                    <p className="text-[10px] text-app-muted uppercase tracking-widest">Withdrawal Request</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-app-text">{item.amount}</p>
                  <p className={cn("text-[10px] font-bold uppercase tracking-widest", item.color)}>{item.status}</p>
                </div>
              </div>
            ))}
          </div> */}
        </GlowCard>
      </div>
    </div>
  );
}
