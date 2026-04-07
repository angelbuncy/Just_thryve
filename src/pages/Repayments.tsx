import { useState, useEffect, useMemo } from "react";
import { Card, Badge, Button } from "../components/UI";
import { formatCurrency } from "../lib/utils";
import { CheckCircle2, Clock, AlertCircle, Receipt } from "lucide-react";
import { repaymentApi, dashboardApi, receiptApi } from "../services/api";
import { useNotifications } from "../context/NotificationContext";

export function Repayments() {
  const [repayments, setRepayments] = useState<any[]>([]);
  const [dashData, setDashData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    Promise.all([
      repaymentApi.getSchedule(),
      dashboardApi.borrower()
    ]).then(([schedule, dash]) => {
      setRepayments(Array.isArray(schedule) ? schedule : []);
      setDashData(dash);
    }).finally(() => setLoading(false));
  }, []);

  const handleViewReceipt = async (transactionId: string) => {
    try {
      const receipt = await receiptApi.get(transactionId);
      addNotification({
        title: "Receipt Generated",
        desc: `Receipt for transaction ${transactionId} is ready for download.`,
        type: "success"
      });
      // In a real app, we might open a PDF or a modal
      console.log("Receipt data:", receipt);
    } catch (err: any) {
      addNotification({
        title: "Error",
        desc: "Could not retrieve receipt: " + err.message,
        type: "error"
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-muted">Loading repayments...</div>;
  }

  const totalRepaid = dashData?.total_repaid || 0;
  const totalApproved = dashData?.total_approved || 0;
  const remainingBalance = totalApproved - totalRepaid;
  const nextEMIDate = dashData?.next_emi_date ? new Date(dashData.next_emi_date).toLocaleDateString() : "N/A";
  const repaidPercent = totalApproved > 0 ? Math.round((totalRepaid / totalApproved) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-soft">Repayments</h1>
        <p className="text-slate-muted">Manage your loan repayments and flow-based ECS schedules.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-indigo-primary/5 border-indigo-primary/20">
          <p className="text-sm text-slate-muted">Total Repaid</p>
          <p className="text-2xl font-bold text-slate-soft">{formatCurrency(totalRepaid)}</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/5">
            <div className="h-full rounded-full bg-indigo-primary" style={{ width: `${repaidPercent}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-muted">{repaidPercent}% of total loan</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-muted">Remaining Balance</p>
          <p className="text-2xl font-bold text-slate-soft">{formatCurrency(remainingBalance)}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-muted">Next EMI Date</p>
          <p className="text-2xl font-bold text-indigo-primary">{nextEMIDate}</p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-6 text-lg font-bold text-slate-soft">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-slate-muted uppercase tracking-wider">
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Method</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {repayments.map((rp) => (
                <tr key={rp.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 text-sm text-slate-soft">{new Date(rp.date).toLocaleDateString()}</td>
                  <td className="py-4 text-sm font-bold text-slate-soft">{formatCurrency(rp.amount)}</td>
                  <td className="py-4 text-sm text-slate-muted">{rp.type || "Auto-debit"}</td>
                  <td className="py-4">
                    <Badge variant={rp.status === "PAID" ? "success" : "warning"}>
                      {rp.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewReceipt(rp.id)}>
                      <Receipt className="mr-2 h-4 w-4" />
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
              {repayments.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-muted">No repayment history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex items-start gap-4 rounded-2xl bg-indigo-primary/5 border border-indigo-primary/20 p-6">
        <AlertCircle className="h-6 w-6 text-indigo-primary shrink-0" />
        <div>
          <h4 className="font-bold text-slate-soft">Flow-based Adjustment</h4>
          <p className="text-sm text-slate-muted">
            Your EMI is dynamically adjusted to 15% of your verified GST revenue. 
            If your revenue drops below threshold, your tenure will automatically extend to maintain healthy cash flows.
          </p>
        </div>
      </div>
    </div>
  );
}
