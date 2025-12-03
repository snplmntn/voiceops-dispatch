import { useState, useCallback } from 'react';
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/Header';
import { VoiceButton } from '@/components/VoiceButton';
import { Badge } from '@/components/ui/badge';
import { useTickets, Ticket } from '@/context/TicketContext';
import { cn } from '@/lib/utils';

interface OperationsViewProps {
  onBack: () => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'success';

const mockIssues = [
  { machine: 'Line 4 Heater', issue: 'Overheat Warning', priority: 'critical' as const, zone: 'Zone A' },
  { machine: 'Pump Station 2', issue: 'Pressure Drop', priority: 'high' as const, zone: 'Zone B' },
  { machine: 'Assembly Robot 3', issue: 'Calibration Needed', priority: 'low' as const, zone: 'Zone C' },
];

export function OperationsView({ onBack }: OperationsViewProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [recentReports, setRecentReports] = useState<Ticket[]>([]);
  const [lastCreatedTicket, setLastCreatedTicket] = useState<Ticket | null>(null);
  const { addTicket } = useTickets();

  const handleVoiceStart = useCallback(() => {
    setVoiceState('listening');
  }, []);

  const handleVoiceEnd = useCallback(() => {
    if (voiceState !== 'listening') return;
    
    setVoiceState('processing');
    
    // Simulate AI processing
    setTimeout(() => {
      const randomIssue = mockIssues[Math.floor(Math.random() * mockIssues.length)];
      const newTicket = addTicket({
        machineName: randomIssue.machine,
        zone: randomIssue.zone,
        issueSummary: randomIssue.issue,
        priority: randomIssue.priority,
        status: 'open',
        aiActionPlan: '1. Check system status\n2. Run diagnostics\n3. Apply fix\n4. Verify operation',
        reportedBy: 'Current User',
      });
      
      setLastCreatedTicket(newTicket);
      setRecentReports(prev => [newTicket, ...prev].slice(0, 5));
      setVoiceState('success');
      
      // Reset after showing success
      setTimeout(() => {
        setVoiceState('idle');
        setLastCreatedTicket(null);
      }, 4000);
    }, 2000);
  }, [voiceState, addTicket]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        title="Operations" 
        subtitle="Voice Issue Reporter"
        onBack={onBack} 
      />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Voice Button Section */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-md w-full">
          {voiceState === 'idle' && (
            <>
              <p className="text-muted-foreground text-center text-lg">
                Hold to Report Issue
              </p>
              <VoiceButton
                isListening={false}
                onMouseDown={handleVoiceStart}
                onMouseUp={handleVoiceEnd}
              />
              <p className="text-sm text-muted-foreground">
                Press and hold, then describe the issue
              </p>
            </>
          )}

          {voiceState === 'listening' && (
            <>
              <div className="flex items-center gap-2 text-accent">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <span className="text-xl font-mono">Listening...</span>
              </div>
              <VoiceButton
                isListening={true}
                onMouseDown={handleVoiceStart}
                onMouseUp={handleVoiceEnd}
              />
              <p className="text-sm text-muted-foreground animate-pulse">
                Release when finished
              </p>
            </>
          )}

          {voiceState === 'processing' && (
            <div className="flex flex-col items-center gap-6 animate-fade-up">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-xl font-mono text-foreground mb-2">Analyzing Voice...</p>
                <p className="text-sm text-muted-foreground">AI is processing your report</p>
              </div>
            </div>
          )}

          {voiceState === 'success' && lastCreatedTicket && (
            <div className="w-full bg-card border border-success/50 rounded-lg p-6 animate-fade-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-mono font-bold text-success">Ticket Created!</p>
                  <p className="text-sm text-muted-foreground">
                    #{lastCreatedTicket.ticketNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={lastCreatedTicket.priority}>{lastCreatedTicket.priority}</Badge>
                  <span className="font-semibold">{lastCreatedTicket.machineName}</span>
                </div>
                <p className="text-muted-foreground">{lastCreatedTicket.issueSummary}</p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Reports */}
        {recentReports.length > 0 && voiceState === 'idle' && (
          <div className="w-full max-w-md mt-8">
            <h2 className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">
              My Recent Reports
            </h2>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={cn(
                      "w-5 h-5",
                      report.priority === 'critical' && "text-destructive",
                      report.priority === 'high' && "text-warning",
                      report.priority === 'low' && "text-primary"
                    )} />
                    <div>
                      <p className="font-medium text-sm">{report.machineName}</p>
                      <p className="text-xs text-muted-foreground">#{report.ticketNumber}</p>
                    </div>
                  </div>
                  <Badge variant={report.priority} className="text-xs">
                    {report.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
