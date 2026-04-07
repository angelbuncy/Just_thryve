import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  Globe, 
  Lock,
  ChevronRight,
  Sun,
  Moon,
  Play,
  CheckCircle2,
  Activity,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button, Card, Badge } from "../components/UI";
import { cn } from "../lib/utils";
import { useTheme } from "../context/ThemeContext";

import { HeroSection } from "../components/ui/hero-odyssey";
import { GlowCard } from "../components/GlowCard";

export function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans text-slate-soft selection:bg-indigo-primary/30">
      
      <HeroSection />
      
      {/* Borrower-Centric Stats */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { label: "Interest Saved", value: "₹2.4 Cr+", desc: "By SMEs with high ESG scores" },
              { label: "Processing Time", value: "< 48 Hours", desc: "From application to offer" },
              { label: "Active Borrowers", value: "1,200+", desc: "Growing businesses across India" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="mb-2 text-4xl font-black tracking-tighter text-indigo-primary">{stat.value}</p>
                <p className="mb-1 text-lg font-bold text-slate-soft">{stat.label}</p>
                <p className="text-sm text-slate-muted">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works for Borrowers */}
      <section className="relative z-10 py-24 bg-white/5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-soft md:text-5xl">Your Path to Growth</h2>
            <p className="mx-auto max-w-2xl text-slate-muted">Three simple steps to unlock ESG-linked financing for your business.</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Apply Online", desc: "Share your business details and link your GST/Bank accounts securely." },
              { step: "02", title: "ESG Assessment", desc: "Our AI evaluates your sustainability impact to unlock better rates." },
              { step: "03", title: "Get Funded", desc: "Choose from multiple offers and receive funds in your account." },
            ].map((item, i) => (
              <GlowCard key={i} className="border-none bg-black/40 p-8" glowColor="rgba(99, 102, 241, 0.2)">
                <span className="mb-6 block text-5xl font-black text-indigo-primary/20">{item.step}</span>
                <h3 className="mb-4 text-xl font-bold text-slate-soft">{item.title}</h3>
                <p className="text-slate-muted leading-relaxed">{item.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-indigo-primary to-cyan-accent p-12 shadow-2xl shadow-indigo-500/20"
          >
            <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">Ready to scale your business?</h2>
            <p className="mb-10 text-lg text-white/80">Join 1,200+ SMEs who are growing sustainably with Just Thryve.</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth/register">
                <Button size="lg" className="h-14 rounded-full bg-white px-10 text-indigo-primary hover:bg-white/90">
                  Apply for Loan Now
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button size="lg" variant="outline" className="h-14 rounded-full border-white/30 text-white hover:bg-white/10">
                  Check Eligibility
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-20 px-6 bg-navy-deep/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-primary to-cyan-accent">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-soft">JUST THRYVE</span>
              </div>
              <p className="max-w-xs text-slate-muted leading-relaxed">
                Empowering the green economy through innovative financial technology and ESG-linked credit solutions.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-soft mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-muted">
                <li><a href="#" className="hover:text-indigo-primary transition-colors">Borrowers</a></li>
                <li><a href="#" className="hover:text-indigo-primary transition-colors">Lenders</a></li>
                <li><a href="#" className="hover:text-indigo-primary transition-colors">ESG Framework</a></li>
                <li><a href="#" className="hover:text-indigo-primary transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-soft mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-muted">
                <li><a href="#" className="hover:text-indigo-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-indigo-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-primary transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-indigo-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs text-slate-muted">© 2026 JUST THRYVE. All rights reserved.</p>
            <div className="flex gap-8 text-xs text-slate-muted">
              <a href="#" className="hover:text-slate-soft transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-soft transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-soft transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
