import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Leaf, 
  Wind, 
  Droplets, 
  Recycle, 
  Users, 
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Plus,
  X
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Card, Badge, Button } from "../components/UI";
import { MOCK_ESG_METRICS } from "../data/mockData";
import { cn } from "../lib/utils";
import { esgApi } from "../services/api";
import { useNotifications } from "../context/NotificationContext";

const BENCHMARK_DATA = [
  { category: "Energy", yourScore: 85, industryAvg: 45 },
  { category: "Waste", yourScore: 65, industryAvg: 50 },
  { category: "Social", yourScore: 88, industryAvg: 72 },
  { category: "Governance", yourScore: 92, industryAvg: 80 },
];

export function ESGInsights() {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    renewableEnergyPercent: MOCK_ESG_METRICS.renewableEnergyPercent,
    carbonIntensity: MOCK_ESG_METRICS.carbonIntensity,
    wasteRecycledPercent: MOCK_ESG_METRICS.wasteRecycledPercent,
    socialImpactScore: MOCK_ESG_METRICS.socialImpactScore,
  });

  const handleUpdateESG = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await esgApi.updateMetrics(formData);
      addNotification({
        title: "ESG Metrics Updated",
        desc: "Your ESG data has been successfully updated and logged on the blockchain.",
        type: 'success'
      });
      setShowUpdateForm(false);
    } catch (error) {
      addNotification({
        title: "Update Failed",
        desc: error instanceof Error ? error.message : "Could not update ESG metrics.",
        type: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const ESG_DETAILS = [
    { label: "Renewable Energy", value: formData.renewableEnergyPercent, icon: Wind, color: "text-indigo-primary", bg: "bg-indigo-primary/10", unit: "%" },
    { label: "Carbon Intensity", value: formData.carbonIntensity, icon: Leaf, color: "text-cyan-accent", bg: "bg-cyan-accent/10", unit: "tCO2e" },
    { label: "Waste Recycled", value: formData.wasteRecycledPercent, icon: Recycle, color: "text-indigo-primary", bg: "bg-indigo-primary/10", unit: "%" },
    { label: "Social Impact", value: formData.socialImpactScore, icon: Users, color: "text-cyan-accent", bg: "bg-cyan-accent/10", unit: "/100" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-soft">ESG Insights</h1>
          <p className="text-slate-muted">Detailed breakdown of your environmental and social performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowUpdateForm(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Update Metrics
          </Button>
          <Badge variant="success" className="h-fit px-4 py-1.5 text-sm">
            Top 5% in Industry
          </Badge>
        </div>
      </div>

      <AnimatePresence>
        {showUpdateForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUpdateForm(false)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-navy-deep p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-soft">Update ESG Metrics</h2>
                <button onClick={() => setShowUpdateForm(false)} className="text-slate-muted hover:text-slate-soft">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateESG} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-muted uppercase tracking-wider">Renewable Energy (%)</label>
                  <input 
                    type="number" 
                    value={formData.renewableEnergyPercent}
                    onChange={(e) => setFormData({...formData, renewableEnergyPercent: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-slate-soft outline-none focus:ring-1 focus:ring-indigo-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-muted uppercase tracking-wider">Carbon Intensity (tCO2e)</label>
                  <input 
                    type="number" 
                    value={formData.carbonIntensity}
                    onChange={(e) => setFormData({...formData, carbonIntensity: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-slate-soft outline-none focus:ring-1 focus:ring-indigo-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-muted uppercase tracking-wider">Waste Recycled (%)</label>
                  <input 
                    type="number" 
                    value={formData.wasteRecycledPercent}
                    onChange={(e) => setFormData({...formData, wasteRecycledPercent: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-slate-soft outline-none focus:ring-1 focus:ring-indigo-primary/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-muted uppercase tracking-wider">Social Impact Score (/100)</label>
                  <input 
                    type="number" 
                    value={formData.socialImpactScore}
                    onChange={(e) => setFormData({...formData, socialImpactScore: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-slate-soft outline-none focus:ring-1 focus:ring-indigo-primary/50"
                  />
                </div>
                <Button type="submit" className="w-full mt-4" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Submit Updates"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ESG Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {ESG_DETAILS.map((item, i) => (
          <Card key={i} className="group hover:border-indigo-primary/30 transition-all">
            <div className="mb-4 flex items-center justify-between">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", item.bg)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <TrendingUp className="h-4 w-4 text-indigo-primary" />
            </div>
            <p className="text-sm text-slate-muted">{item.label}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-slate-soft">{item.value}</p>
              <span className="text-sm text-slate-muted">{item.unit}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Industry Benchmark */}
        <Card className="lg:col-span-2">
          <h3 className="mb-6 text-lg font-bold text-slate-soft">Industry Benchmarking</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BENCHMARK_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  stroke="#94A3B8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Bar dataKey="yourScore" name="Your Score" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={20} />
                <Bar dataKey="industryAvg" name="Industry Average" fill="#ffffff10" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Improvement Suggestions */}
        <Card>
          <h3 className="mb-6 text-lg font-bold text-slate-soft">Improvement Areas</h3>
          <div className="space-y-4">
            {[
              { title: "Waste Management", desc: "Increase recycling rate by 15% to unlock 0.2% rate discount.", impact: "High" },
              { title: "Supply Chain", desc: "Onboard 2 more green-certified vendors.", impact: "Medium" },
              { title: "Data Transparency", desc: "Submit quarterly ESG audit for higher trust score.", impact: "Low" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl bg-white/5 p-4 border border-white/5 hover:border-indigo-primary/20 transition-all">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-semibold text-slate-soft">{item.title}</p>
                  <Badge variant={item.impact === "High" ? "success" : "default"}>{item.impact}</Badge>
                </div>
                <p className="text-xs text-slate-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Compliance Section */}
      <Card className="border-indigo-primary/20 bg-indigo-primary/5">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-primary/20 text-indigo-primary">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-soft">Compliance Status: Verified</h3>
              <p className="text-sm text-slate-muted">All regulatory ESG filings are up to date as of April 2026.</p>
            </div>
          </div>
          <Button variant="outline" size="sm">View Certificates</Button>
        </div>
      </Card>
    </div>
  );
}
