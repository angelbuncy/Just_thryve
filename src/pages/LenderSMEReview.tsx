import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  Leaf, 
  ArrowRight,
  ChevronDown,
  Info,
  Loader2
} from "lucide-react";
import { Card, Button, Badge } from "../components/UI";
import { lenderApi } from "../services/api";
import { formatCurrency, cn } from "../lib/utils";

interface SME {
  id: string;
  name: string;
  sector: string;
  esg_score: number;
  requested_amount: number;
  risk_grade: string;
}

export function LenderSMEReview() {
  const [smes, setSmes] = useState<SME[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");

  useEffect(() => {
    const fetchSMEs = async () => {
      try {
        const data = await lenderApi.getSMEs();
        setSmes(data);
      } catch (error) {
        console.error("Failed to fetch SMEs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSMEs();
  }, []);

  const filteredSMEs = smes.filter(sme => {
    const matchesSearch = sme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sme.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "All" || sme.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const sectors = ["All", ...new Set(smes.map(s => s.sector))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-soft">Review SMEs</h1>
          <p className="text-slate-muted">Discover and evaluate high-potential SMEs for your lending portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-indigo-primary/10 px-4 py-2 text-xs font-medium text-indigo-primary border border-indigo-primary/20">
            <TrendingUp className="h-4 w-4" />
            Avg. ESG Score: 845
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-muted" />
          <input 
            type="text" 
            placeholder="Search by business name or sector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-slate-soft outline-none focus:ring-1 focus:ring-indigo-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-indigo-primary" />
          <select 
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-navy-deep border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-soft focus:outline-none focus:ring-1 focus:ring-indigo-primary/50"
          >
            {sectors.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 text-indigo-primary animate-spin" />
          <p className="text-slate-muted">Loading high-potential SMEs...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredSMEs.map((sme, i) => (
            <motion.div
              key={sme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group hover:border-indigo-primary/30 transition-all overflow-hidden">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-primary/10 flex items-center justify-center text-indigo-primary">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-soft group-hover:text-indigo-primary transition-colors">{sme.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-muted">
                        <Badge variant="default" className="bg-white/5 text-slate-muted border-white/10">{sme.sector}</Badge>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-muted uppercase tracking-wider">Risk Grade</p>
                    <p className={cn(
                      "text-xl font-bold",
                      sme.risk_grade.startsWith('A') ? "text-emerald-400" : "text-amber-400"
                    )}>{sme.risk_grade}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-slate-muted uppercase tracking-wider mb-1">Requested Amount</p>
                    <p className="text-lg font-bold text-slate-soft">₹{(sme.requested_amount / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-xs text-slate-muted uppercase tracking-wider mb-1">ESG Score</p>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-indigo-primary" />
                      <p className="text-lg font-bold text-indigo-primary">{sme.esg_score}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-slate-muted">
                    <Info className="h-3 w-3" />
                    <span>Last audited: 2 days ago</span>
                  </div>
                  <Button size="sm" variant="ghost" className="group/btn">
                    Review Profile
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
          {filteredSMEs.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-muted">No SMEs found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
