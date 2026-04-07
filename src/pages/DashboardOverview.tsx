import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Leaf, 
  Activity, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  ShieldCheck,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  Filter,
  Search,
  MoreVertical,
  Zap,
  Globe,
  Lock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import { Card, Badge, Button } from "../components/UI";
import { GlowCard } from "../components/GlowCard";
import Aurora from "../components/Aurora";
import { MOCK_REVENUE_DATA, MOCK_ESG_METRICS } from "../data/mockData";
import { formatCurrency, cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { useESG } from "../context/ESGContext";
import { useNotifications } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { dashboardApi, loanApi, repaymentApi } from "../services/api";
import { LenderDashboardResponse, BorrowerDashboardResponse, LoanApplication } from "../types";
import { useState, useEffect, useMemo } from "react";

const COLORS = ["#6366F1", "#4F46E5", "#22D3EE", "#0EA5E9"];

export function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isLender = user?.role === 'LENDER';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-soft">
            {isLender ? "Lender Command Center" : "My Loan Dashboard"}
          </h1>
          <p className="text-slate-muted">
            {isLender 
              ? "Monitor your portfolio risk and ESG-linked assets." 
              : `Welcome back, ${user?.name.split(' ')[0]}. Here's your loan performance.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isLender ? (
            <>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter Assets
              </Button>
              <Button size="sm" onClick={() => navigate("/dashboard/marketplace")}>
                <Zap className="mr-2 h-4 w-4" />
                Fund New Loan
              </Button>
              <Button size="sm" variant="secondary">
                <TrendingUp className="mr-2 h-4 w-4" />
                Portfolio Analytics
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm">Download Report</Button>
              <Button size="sm" onClick={() => navigate("/dashboard/apply")}>Apply for New Loan</Button>
            </>
          )}
        </div>
      </motion.div>

      {isLender ? <LenderDashboard /> : <BorrowerDashboard />}
    </div>
  );
}

function BorrowerDashboard() {
  const { score: ecsScore } = useESG();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [data, setData] = useState<BorrowerDashboardResponse | null>(null);
  const [repayments, setRepayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardApi.borrower(),
      repaymentApi.getSchedule()
    ]).then(([dash, schedule]) => {
      setData(dash);
      setRepayments(Array.isArray(schedule) ? schedule : []);
    }).finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(() => {
    if (!Array.isArray(repayments) || !repayments.length) return [];
    const monthly: Record<string, number> = {};
    repayments.forEach((rp: any) => {
      const date = new Date(rp.date);
      const month = date.toLocaleString('default', { month: 'short' });
      monthly[month] = (monthly[month] || 0) + rp.amount;
    });
    return Object.entries(monthly).map(([name, amount]) => ({ name, amount }));
  }, [repayments]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative space-y-12 overflow-hidden rounded-3xl p-8">
      
      {/* Aurora Background */}
      <Aurora 
        colorStops={["#1E293B", "#3B82F6", "#1E293B"]} 
        amplitude={0.8} 
        blend={0.8}
      />
      
      {/* Yin Yang Background Element */}
      <div className="absolute -right-20 -top-20 h-[600px] w-[600px] rounded-full bg-indigo-primary/10 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-soft">My Loan Dashboard</h2>
        <Button onClick={() => navigate('/dashboard/apply')}>
          Apply for New Loan
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Hero Metrics */}
      <div className="relative z-10 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Approved", value: formatCurrency(data?.total_approved || 0), icon: CreditCard, color: "text-indigo-primary", bg: "bg-indigo-primary/10" },
          { label: "Outstanding Balance", value: formatCurrency((data?.total_approved || 0) - (data?.total_repaid || 0)), icon: Activity, color: "text-cyan-accent", bg: "bg-cyan-accent/10" },
          { label: "Next EMI Due", value: data?.next_emi_date ? new Date(data.next_emi_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : "N/A", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "EMI Amount", value: formatCurrency(data?.next_emi_amount || 0), icon: Zap, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Total Repaid", value: formatCurrency(data?.total_repaid || 0), icon: CheckCircle2, color: "text-indigo-primary", bg: "bg-indigo-primary/10" },
        ].map((stat, i) => (
          <GlowCard key={i} className="border-none bg-app-bg/40 backdrop-blur-xl p-6" glowColor="rgba(99, 102, 241, 0.2)">
            <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-xl", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-app-muted">{stat.label}</p>
            <p className="text-xl font-black text-app-text">{stat.value}</p>
          </GlowCard>
        ))}
      </div>

      {/* Yang Section: Repayment & Progress */}
      <section className="relative z-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-primary/20 to-indigo-primary/50" />
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-primary">Loan Progress & Schedule</h2>
          <div className="h-px w-12 bg-indigo-primary/50" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Repayment Schedule */}
          <GlowCard className="lg:col-span-2 overflow-hidden border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(99, 102, 241, 0.5)">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-bold text-app-text">Repayment Schedule</h3>
              <Badge variant="outline" className="border-indigo-primary/30 text-indigo-primary">
                Next: {formatCurrency(data?.next_emi_amount || 0)}
              </Badge>
            </div>
            
            {/* Repayment Trend Chart */}
            <div className="mb-8 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--app-bg)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--app-text)' }}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#6366F1" fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {repayments.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-app-text/5 p-4 border border-border-subtle">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-app-muted" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-app-text">{new Date(item.date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-app-muted uppercase tracking-widest">EMI Payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-app-text">{formatCurrency(item.amount)}</p>
                    <p className={cn("text-[10px] font-bold uppercase tracking-widest", 
                      item.status === 'PAID' ? "text-emerald-400" : "text-amber-400"
                    )}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Credit Score Widget */}
          <GlowCard className="flex flex-col items-center justify-center border-none bg-app-bg/40 backdrop-blur-xl text-center p-8" glowColor="rgba(99, 102, 241, 0.5)">
            <div className="relative mb-6">
              <svg className="h-48 w-48 -rotate-90 transform">
                <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-primary/10" />
                <motion.circle
                  cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray={502.6}
                  initial={{ strokeDashoffset: 502.6 }}
                  animate={{ strokeDashoffset: 502.6 - (502.6 * 785) / 900 }}
                  transition={{ duration: 2, ease: "circOut" }}
                  className="text-indigo-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-app-text tracking-tighter">785</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-primary">Credit Score</span>
              </div>
            </div>
            <div className="space-y-2">
              <Badge variant="success" className="rounded-full">Excellent</Badge>
              <p className="text-xs text-app-muted max-w-[200px]">Your score increased by 12 points this month due to timely repayments.</p>
            </div>
            <Button variant="outline" size="sm" className="mt-6 w-full rounded-xl border-indigo-primary/30 text-indigo-primary hover:bg-indigo-primary/10">
              View Full Report
            </Button>
          </GlowCard>
        </div>
      </section>

      {/* Yin Section: Loan Progress Bars */}
      <section className="relative z-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px w-12 bg-cyan-accent/50" />
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-accent">Loan Progress</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-accent/20 to-cyan-accent/50" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Progress Bars */}
          <GlowCard className="lg:col-span-2 border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(34, 211, 238, 0.5)">
            <h3 className="mb-8 text-lg font-bold text-app-text">Active Loan Breakdown</h3>
            <div className="space-y-8">
              {[
                { label: "Working Capital Loan", progress: 65, total: "₹10,00,000", paid: "₹6,50,000", color: "bg-indigo-primary" },
                { label: "Equipment Financing", progress: 30, total: "₹2,50,000", paid: "₹75,000", color: "bg-cyan-accent" },
              ].map((loan, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-app-text">{loan.label}</p>
                      <p className="text-[10px] text-app-muted uppercase tracking-widest">{loan.paid} of {loan.total} paid</p>
                    </div>
                    <span className="text-sm font-black text-app-text">{loan.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-app-text/5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${loan.progress}%` }} 
                      className={cn("h-full", loan.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* ESG Insights Summary */}
          <GlowCard className="border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(99, 102, 241, 0.5)">
            <div className="mb-6 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-app-text">ESG Impact</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-app-muted">ESG Score</span>
                <span className="text-sm font-bold text-emerald-400">{ecsScore}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-app-muted">Interest Saved</span>
                <span className="text-sm font-bold text-indigo-primary">₹12,400</span>
              </div>
              <div className="pt-4 border-t border-border-subtle">
                <p className="text-[10px] text-app-muted uppercase tracking-widest mb-3">Top Impact Area</p>
                <div className="flex items-center gap-3 rounded-xl bg-emerald-400/10 p-3">
                  <Globe className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">Renewable Energy Adoption</span>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>
    </div>
  );
}

function LenderDashboard() {
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [data, setData] = useState<LenderDashboardResponse | null>(null);
  const [opportunities, setOpportunities] = useState<LoanApplication[]>([]);
  const [avgESG, setAvgESG] = useState<number>(0);
  const [collectionRate, setCollectionRate] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dash, opps, esg, schedule] = await Promise.all([
        dashboardApi.lender(),
        loanApi.list('submitted'),
        loanApi.getPortfolioAvgESG(),
        repaymentApi.getSchedule()
      ]);
      setData(dash);
      setOpportunities(Array.isArray(opps) ? opps : []);
      setAvgESG(esg?.score || 0);
      
      if (Array.isArray(schedule) && schedule.length > 0) {
        const paid = schedule.filter(r => r.status === 'PAID').length;
        setCollectionRate((paid / schedule.length) * 100);
      }
      
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

  const riskDistribution = useMemo(() => {
    if (!data || !data.offers) return [
      { name: 'Low', value: 0 },
      { name: 'Medium', value: 0 },
      { name: 'High', value: 0 }
    ];
    const low = data.offers.filter(o => o.risk_score > 700).length;
    const med = data.offers.filter(o => o.risk_score >= 500 && o.risk_score <= 700).length;
    const high = data.offers.filter(o => o.risk_score < 500).length;
    return [
      { name: 'Low', value: low },
      { name: 'Medium', value: med },
      { name: 'High', value: high }
    ];
  }, [data]);

  const filteredOpportunities = useMemo(() => {
    if (!Array.isArray(opportunities)) return [];
    return opportunities.filter(o => 
      o.business_profile?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [opportunities, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="grid gap-6 md:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[400px] animate-pulse rounded-2xl bg-white/5" />
          <div className="h-[400px] animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-rose-500/50 bg-rose-500/5 p-8 text-center">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
        <h2 className="mb-2 text-xl font-bold text-app-text">Dashboard Error</h2>
        <p className="mb-6 text-slate-muted">{error}</p>
        <Button onClick={fetchData}>Retry Connection</Button>
      </Card>
    );
  }

  const riskLevel = data && data.average_interest_rate < 11 ? "Low" : data && data.average_interest_rate <= 14 ? "Med" : "High";

  return (
    <div className="relative space-y-12 overflow-hidden rounded-3xl p-8">

      {/* Aurora Background */}
      <Aurora 
        colorStops={["#1E293B", "#06B6D4", "#1E293B"]} 
        amplitude={0.8} 
        blend={0.8}
      />

      {/* Yin Yang Background Element */}
      <div className="absolute -left-20 -bottom-20 h-[600px] w-[600px] rounded-full bg-cyan-accent/10 blur-[120px] pointer-events-none z-0" />

      {/* Yin Section: Capital Stability */}
      <section className="relative z-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px w-12 bg-indigo-primary/50" />
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-primary">Yin / Capital Stability</h2>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-indigo-primary/20 to-indigo-primary/50" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            { label: "Total AUM", value: formatCurrency(data?.portfolio_value || 0), icon: Globe, color: "text-indigo-primary", bg: "bg-indigo-primary/10", glow: "rgba(99, 102, 241, 0.3)" },
            { label: "Active Loans", value: data?.accepted_offer_count || 0, icon: Users, color: "text-cyan-accent", bg: "bg-cyan-accent/10", glow: "rgba(34, 211, 238, 0.3)" },
            { label: "Avg. ESG", value: avgESG, icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-400/10", glow: "rgba(52, 211, 153, 0.3)" },
            { label: "Risk Level", value: riskLevel, icon: ShieldCheck, color: "text-indigo-primary", bg: "bg-indigo-primary/10", glow: "rgba(99, 102, 241, 0.3)" },
            { label: "Portfolio Yield", value: `${data?.average_interest_rate || 0}%`, icon: TrendingUp, color: "text-cyan-accent", bg: "bg-cyan-accent/10", glow: "rgba(34, 211, 238, 0.3)" },
            { label: "Total Offers", value: data?.offer_count || 0, icon: Zap, color: "text-emerald-400", bg: "bg-emerald-400/10", glow: "rgba(52, 211, 153, 0.3)" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <GlowCard className="group relative overflow-hidden border-none bg-app-bg/40 backdrop-blur-xl p-4 transition-all hover:bg-app-bg/60" glowColor={stat.glow}>
                <div className={cn("mb-3 flex h-8 w-8 items-center justify-center rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-app-muted">{stat.label}</p>
                <p className="text-lg font-black text-app-text">{stat.value}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Yang Section: Active Deployment */}
      <section className="relative z-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-accent/20 to-cyan-accent/50" />
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-accent">Yang / Active Deployment</h2>
          <div className="h-px w-12 bg-cyan-accent/50" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Active Opportunities Table */}
          <GlowCard className="lg:col-span-2 border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(99, 102, 241, 0.5)">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-app-text">Active Opportunities</h3>
                <p className="text-xs text-app-muted">Loans awaiting lender offers</p>
              </div>
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
                <input
                  type="text"
                  placeholder="Filter by business..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 w-full rounded-xl bg-white/5 pl-10 pr-4 text-xs text-app-text outline-none border border-border-subtle focus:border-indigo-primary/50"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border-subtle text-[10px] font-bold uppercase tracking-widest text-app-muted">
                    <th className="pb-4 pr-4">Business Name</th>
                    <th className="pb-4 pr-4">Amount</th>
                    <th className="pb-4 pr-4">ESG Score</th>
                    <th className="pb-4 pr-4">Risk</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((loan) => {
                      const risk = loan.risk_score > 700 ? "Low" : loan.risk_score > 500 ? "Medium" : "High";
                      return (
                        <tr key={loan.id} className="group transition-colors hover:bg-white/5">
                          <td className="py-4 pr-4 text-sm font-bold text-app-text">{loan.business_profile.business_name}</td>
                          <td className="py-4 pr-4 text-sm text-app-text">{formatCurrency(loan.amount)}</td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <Leaf className="h-3 w-3 text-emerald-400" />
                              <span className="text-sm font-bold text-emerald-400">{loan.risk_score}</span>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <Badge variant={risk === 'Low' ? 'success' : risk === 'Medium' ? 'warning' : 'error'}>
                              {risk}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <Button size="sm" onClick={() => navigate(`/dashboard/marketplace?loanId=${loan.id}`)}>Make Offer</Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-muted">
                        No active opportunities found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlowCard>

          {/* Risk Distribution & Collection Rate */}
          <div className="space-y-8">
            <GlowCard className="border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(99, 102, 241, 0.5)">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-indigo-primary">Risk Distribution</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--app-bg)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--app-text)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                {riskDistribution.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-[10px] text-app-muted uppercase tracking-widest">{entry.name}</span>
                  </div>
                ))}
              </div>
            </GlowCard>

            <GlowCard className="border-none bg-app-bg/40 backdrop-blur-xl p-8" glowColor="rgba(34, 211, 238, 0.5)">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-accent">Collection Rate</h3>
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="relative mb-6 flex justify-center">
                <svg className="h-32 w-32 -rotate-90 transform">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-cyan-accent/10" />
                  <motion.circle
                    cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={351.8}
                    initial={{ strokeDashoffset: 351.8 }}
                    animate={{ strokeDashoffset: 351.8 - (351.8 * collectionRate) / 100 }}
                    transition={{ duration: 2, ease: "circOut" }}
                    className="text-cyan-accent"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-app-text">{collectionRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest">
                <span className="text-app-muted">Target</span>
                <span className="text-app-text font-bold">99.0%</span>
              </div>
            </GlowCard>
          </div>
        </div>
      </section>
    </div>
  );
}

function Calendar(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}

