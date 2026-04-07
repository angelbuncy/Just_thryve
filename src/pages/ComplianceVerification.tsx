import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Card, Button, Badge } from "../components/UI";
import { profileApi } from "../services/api";
import { useNotifications } from "../context/NotificationContext";

export function ComplianceVerification() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await profileApi.requestVerification({});
      addNotification({
        title: "Request Submitted",
        desc: "Your compliance verification request is being processed.",
        type: 'success'
      });
      setStep(3);
    } catch (error) {
      addNotification({
        title: "Submission Failed",
        desc: error instanceof Error ? error.message : "Could not submit request.",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-soft">Compliance Verification</h1>
        <p className="text-slate-muted">Apply for verified status to unlock premium lending rates and higher credit limits.</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
              step >= s ? "bg-indigo-primary text-white" : "bg-white/5 text-slate-muted border border-white/10"
            )}>
              {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            <span className={cn(
              "text-sm font-medium",
              step >= s ? "text-slate-soft" : "text-slate-muted"
            )}>
              {s === 1 ? "Information" : s === 2 ? "Documentation" : "Review"}
            </span>
            {s < 3 && <div className="h-px w-12 bg-white/10 mx-2" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-primary/5 border border-indigo-primary/20">
              <ShieldCheck className="h-8 w-8 text-indigo-primary" />
              <div>
                <h3 className="font-bold text-slate-soft">Why get verified?</h3>
                <p className="text-sm text-slate-muted">Verified businesses get 15% lower interest rates and priority matching with top-tier lenders.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-soft">Verification Requirements</h4>
              <ul className="space-y-3">
                {[
                  "Valid GST registration for at least 12 months",
                  "Last 3 years of audited financial statements",
                  "No defaults in the last 24 months",
                  "Minimum ESG score of 700"
                ].map((req, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-muted">
                    <CheckCircle2 className="h-4 w-4 text-indigo-primary" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <Button className="w-full" onClick={() => setStep(2)}>
              Continue to Documentation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-8 space-y-6">
            <h3 className="text-xl font-bold text-slate-soft">Upload Documents</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                "GST Certificate",
                "Financial Statements (FY 23-24)",
                "PAN Card Copy",
                "Business Address Proof"
              ].map((doc, i) => (
                <div key={i} className="p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-primary/30 transition-all group cursor-pointer text-center">
                  <Upload className="h-8 w-8 text-slate-muted group-hover:text-indigo-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-soft">{doc}</p>
                  <p className="text-xs text-slate-muted mt-1">PDF, PNG or JPG (Max 5MB)</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" className="flex-1" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-[2]" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit for Verification
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="p-12 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-indigo-primary/10 flex items-center justify-center text-indigo-primary mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-soft">Application Received!</h2>
              <p className="text-slate-muted max-w-md mx-auto">
                Our compliance team is reviewing your documents. This typically takes 3-5 business days. We'll notify you once the verification is complete.
              </p>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>Return to Dashboard</Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
