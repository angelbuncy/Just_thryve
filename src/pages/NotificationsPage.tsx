import React from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Filter,
  Search
} from "lucide-react";
import { Card, Badge, Button } from "../components/UI";
import { cn } from "../lib/utils";

import { useNotifications } from "../context/NotificationContext";

export function NotificationsPage() {
  const { notifications, markAllAsRead, markAsRead } = useNotifications();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-app-text">Notifications</h1>
          <p className="text-app-muted">Stay updated with your business and credit status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" onClick={markAllAsRead}>Mark all as read</Button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={cn(
              "relative border-border-subtle p-6 transition-all hover:border-indigo-primary/30",
              note.unread && "border-l-4 border-l-indigo-primary"
            )}>
              <div className="flex items-start gap-6">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", note.bg)}>
                  <note.icon className={cn("h-6 w-6", note.color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-app-text">{note.title}</h3>
                      <Badge variant="default" className="text-[10px] bg-white/5 border-white/10">
                        {note.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-app-muted">{note.time || new Date(note.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-sm text-app-muted leading-relaxed">{note.desc}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <button className="text-xs font-bold text-indigo-primary hover:underline flex items-center gap-1">
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    {note.unread && (
                      <button 
                        onClick={() => markAsRead(note.id)}
                        className="text-xs font-medium text-app-muted hover:text-app-text"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Button variant="ghost" className="text-app-muted">
          Load older notifications
        </Button>
      </div>
    </div>
  );
}
