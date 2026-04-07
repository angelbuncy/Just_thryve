import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  Download, 
  Search, 
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, Badge, Button } from "../components/UI";
import { GlowCard } from "../components/GlowCard";
import { dashboardApi } from "../services/api";
import { LenderDashboardResponse } from "../types";
import { formatCurrency, cn } from "../lib/utils";

export function PortfolioPage() {
  const [data, setData] = useState<LenderDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredOffers = useMemo(() => {
    if (!data || !Array.isArray(data.offers)) return [];
    return data.offers.filter(offer => 
      (offer.business_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.loan_id || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const stats = useMemo(() => {
    if (!data || !Array.isArray(data.offers)) return { deployed: 0, avgRate: 0, active: 0, closed: 0 };
    const deployed = data.offers.reduce((acc, curr) => acc + (curr.offered_amount || 0), 0);
    const avgRate = data.average_interest_rate || 0;
    const active = data.offers.filter(o => o.status === 'ACTIVE').length;
    const closed = data.offers.filter(o => o.status === 'CLOSED').length;
    return { deployed, avgRate, active, closed };
  }, [data]);

  const exportToCSV = () => {
    if (!data || !Array.isArray(data.offers)) return;
    const headers = ["Loan ID", "Business Name", "Amount", "Interest Rate", "Tenure", "Status", "Date"];
    const rows = data.offers.map(o => [
      o.loan_id,
      o.business_name,
      o.offered_amount,
      o.interest_rate,
      o.tenure_months,
      o.status,
      o.created_at
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "portfolio_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-rose-500/50 bg-rose-500/5 p-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
        <h2 className="mb-2 text-xl font-bold text-app-text">Failed to load portfolio</h2>
        <p className="mb-6 text-slate-muted">{error}</p>
        <Button onClick={fetchData}>Retry Connection</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-slate-soft">My Portfolio</h1>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Summary Bar */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Deployed", value: formatCurrency(stats.deployed), icon: TrendingUp, color: "text-indigo-primary" },
          { label: "Avg. Rate", value: `${stats.avgRate}%`, icon: ArrowUpRight, color: "text-cyan-accent" },
          { label: "Active Loans", value: stats.active, icon: CheckCircle2, color: "text-emerald-400" },
          { label: "Closed Loans", value: stats.closed, icon: Clock, color: "text-slate-muted" },
        ].map((stat, i) => (
          <GlowCard key={i} className="border-none bg-app-bg/40 backdrop-blur-xl p-6" glowColor="rgba(99, 102, 241, 0.2)">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted">{stat.label}</p>
                <p className="text-xl font-black text-app-text">{stat.value}</p>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* Portfolio Table */}
      <GlowCard className="border-none bg-app-bg/40 backdrop-blur-xl p-0 overflow-hidden" glowColor="rgba(99, 102, 241, 0.3)">
        <div className="border-b border-border-subtle p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
            <input
              type="text"
              placeholder="Search by business name or loan ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-xl bg-white/5 pl-10 pr-4 text-sm text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Loan ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Business Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Rate</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Tenure</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-app-muted">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredOffers.length > 0 ? (
                filteredOffers.map((offer) => (
                  <tr key={offer.id} className="group transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 text-xs font-mono text-indigo-primary">#{offer.loan_id.slice(0, 8)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-app-text">{offer.business_name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-app-text">{formatCurrency(offer.offered_amount)}</td>
                    <td className="px-6 py-4 text-sm text-cyan-accent">{offer.interest_rate}%</td>
                    <td className="px-6 py-4 text-sm text-app-muted">{offer.tenure_months}m</td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant={offer.status === 'ACTIVE' ? 'success' : offer.status === 'CLOSED' ? 'outline' : 'warning'}
                      >
                        {offer.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-app-muted">{new Date(offer.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-muted">
                    No matching loans found in your portfolio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlowCard>
    </div>
  );
}
