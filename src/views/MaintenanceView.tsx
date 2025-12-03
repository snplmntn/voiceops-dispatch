import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { TicketCard } from '@/components/TicketCard';
import { Badge } from '@/components/ui/badge';
import { useTickets } from '@/context/TicketContext';
import { cn } from '@/lib/utils';

interface MaintenanceViewProps {
  onBack: () => void;
}

type FilterType = 'all' | 'critical' | 'high' | 'low';

export function MaintenanceView({ onBack }: MaintenanceViewProps) {
  const { tickets } = useTickets();
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTicketIds, setNewTicketIds] = useState<Set<string>>(new Set());
  const previousTicketsRef = useRef<string[]>([]);

  // Detect new tickets for animation
  useEffect(() => {
    const currentIds = tickets.map(t => t.id);
    const newIds = currentIds.filter(id => !previousTicketsRef.current.includes(id));
    
    if (newIds.length > 0) {
      setNewTicketIds(prev => new Set([...prev, ...newIds]));
      
      // Remove "new" status after animation
      setTimeout(() => {
        setNewTicketIds(prev => {
          const next = new Set(prev);
          newIds.forEach(id => next.delete(id));
          return next;
        });
      }, 3000);
    }
    
    previousTicketsRef.current = currentIds;
  }, [tickets]);

  const filteredTickets = tickets.filter(ticket => {
    if (ticket.status === 'resolved') return false;
    if (filter === 'all') return true;
    return ticket.priority === filter;
  });

  const counts = {
    all: tickets.filter(t => t.status !== 'resolved').length,
    critical: tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length,
    high: tickets.filter(t => t.priority === 'high' && t.status !== 'resolved').length,
    low: tickets.filter(t => t.priority === 'low' && t.status !== 'resolved').length,
  };

  const filters: { key: FilterType; label: string; variant: 'critical' | 'high' | 'low' | 'secondary' }[] = [
    { key: 'all', label: 'All', variant: 'secondary' },
    { key: 'critical', label: 'Critical', variant: 'critical' },
    { key: 'high', label: 'High', variant: 'high' },
    { key: 'low', label: 'Low', variant: 'low' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Maintenance" 
        subtitle="Active Tickets"
        onBack={onBack} 
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map(({ key, label, variant }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all",
                filter === key
                  ? "bg-secondary border-2 border-primary"
                  : "bg-card border border-border hover:border-primary/50"
              )}
            >
              <span>{label}</span>
              <Badge variant={key === 'all' ? 'secondary' : variant} className="text-xs">
                {counts[key]}
              </Badge>
            </button>
          ))}
        </div>

        {/* Tickets Grid */}
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-lg font-mono">No active tickets</p>
            <p className="text-sm">All caught up! 🎉</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                isNew={newTicketIds.has(ticket.id)}
              />
            ))}
          </div>
        )}

        {/* Real-time indicator */}
        <div className="fixed bottom-6 right-6 bg-card border border-border rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-mono text-muted-foreground">
            Real-time sync active
          </span>
        </div>
      </main>
    </div>
  );
}
