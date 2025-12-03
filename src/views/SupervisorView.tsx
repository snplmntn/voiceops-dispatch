import { Clock, Wrench, Ticket, TrendingUp, TrendingDown } from 'lucide-react';
import { Header } from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { useTickets } from '@/context/TicketContext';
import { cn } from '@/lib/utils';

interface SupervisorViewProps {
  onBack: () => void;
}

function MetricCard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  color 
}: { 
  title: string; 
  value: number | string; 
  unit?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  color: 'primary' | 'accent' | 'destructive' | 'success';
}) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    accent: 'text-accent bg-accent/10 border-accent/20',
    destructive: 'text-destructive bg-destructive/10 border-destructive/20',
    success: 'text-success bg-success/10 border-success/20',
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center border",
          colorClasses[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-mono",
            trend === 'up' ? 'text-destructive' : 'text-success'
          )}>
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trend === 'up' ? '+12%' : '-8%'}</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-mono font-bold text-foreground">
        {value}
        {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

export function SupervisorView({ onBack }: SupervisorViewProps) {
  const { tickets, metrics } = useTickets();

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Supervisor" 
        subtitle="Analytics Dashboard"
        onBack={onBack} 
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <MetricCard
            title="Active Downtime"
            value={metrics.activeDowntime}
            unit="min"
            icon={Clock}
            color="destructive"
            trend="up"
          />
          <MetricCard
            title="MTTR (Avg)"
            value={metrics.mttr}
            unit="min"
            icon={Wrench}
            color="accent"
            trend="down"
          />
          <MetricCard
            title="Tickets Today"
            value={metrics.ticketsToday}
            icon={Ticket}
            color="primary"
          />
        </div>

        {/* Tickets Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-mono font-semibold text-foreground">All Tickets</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    Zone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    Machine
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    className={cn(
                      "hover:bg-secondary/30 transition-colors",
                      ticket.priority === 'critical' && "bg-destructive/5"
                    )}
                  >
                    <td className="px-4 py-4 text-sm font-mono text-muted-foreground">
                      {formatTime(ticket.timestamp)}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {ticket.zone}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-foreground">
                      {ticket.machineName}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={ticket.priority}>
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge 
                        variant={
                          ticket.status === 'resolved' ? 'success' :
                          ticket.status === 'in-progress' ? 'secondary' : 'outline'
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tickets.length === 0 && (
            <div className="px-6 py-12 text-center text-muted-foreground">
              <p className="font-mono">No tickets recorded</p>
            </div>
          )}
        </div>

        {/* Live indicator */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="font-mono">Dashboard auto-refreshes</span>
        </div>
      </main>
    </div>
  );
}
