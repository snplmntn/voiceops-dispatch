import { useState } from 'react';
import { Clock, MapPin, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ticket, Priority } from '@/context/TicketContext';
import { cn } from '@/lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  isNew?: boolean;
}

const priorityConfig: Record<Priority, { variant: 'critical' | 'high' | 'low'; label: string }> = {
  critical: { variant: 'critical', label: 'Critical' },
  high: { variant: 'high', label: 'High' },
  low: { variant: 'low', label: 'Low' },
};

function formatTimeAgo(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function TicketCard({ ticket, isNew }: TicketCardProps) {
  const [showPlan, setShowPlan] = useState(false);
  const { variant, label } = priorityConfig[ticket.priority];

  return (
    <div
      className={cn(
        "bg-card border rounded-lg overflow-hidden transition-all duration-300",
        ticket.priority === 'critical' && "border-destructive/50 bg-destructive/5",
        ticket.priority === 'high' && "border-warning/50 bg-warning/5",
        ticket.priority === 'low' && "border-primary/50",
        isNew && "animate-slide-in ring-2 ring-accent"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={variant}>{label}</Badge>
              <span className="text-xs text-muted-foreground font-mono">
                #{ticket.ticketNumber}
              </span>
            </div>
            <h3 className="font-semibold text-foreground">{ticket.machineName}</h3>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <div className="flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(ticket.timestamp)}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{ticket.issueSummary}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {ticket.zone}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPlan(!showPlan)}
            className="text-primary hover:text-primary/80"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            AI Action Plan
            {showPlan ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>

      {showPlan && ticket.aiActionPlan && (
        <div className="border-t border-border bg-secondary/30 p-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="font-mono font-semibold">AI-Generated Action Plan</span>
          </div>
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
            {ticket.aiActionPlan}
          </pre>
        </div>
      )}
    </div>
  );
}
