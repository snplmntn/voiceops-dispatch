import { HardHat, Wrench, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleSelectorProps {
  onSelectRole: (role: 'operations' | 'maintenance' | 'supervisor') => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground mb-3">
          <span className="text-accent">Tick</span>Track
        </h1>
        <p className="text-muted-foreground text-lg">Smart Manufacturing Dispatch</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl px-2">
        <Button
          variant="role"
          onClick={() => onSelectRole('operations')}
          className="group animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
            <HardHat className="w-8 h-8 text-accent" />
          </div>
          <span className="text-xl font-mono font-semibold">Operations</span>
          <span className="text-sm text-muted-foreground">Report issues via voice</span>
        </Button>

        <Button
          variant="role"
          onClick={() => onSelectRole('maintenance')}
          className="group animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Wrench className="w-8 h-8 text-primary" />
          </div>
          <span className="text-xl font-mono font-semibold">Maintenance</span>
          <span className="text-sm text-muted-foreground">Manage active tickets</span>
        </Button>

        <Button
          variant="role"
          onClick={() => onSelectRole('supervisor')}
          className="group animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
            <BarChart3 className="w-8 h-8 text-success" />
          </div>
          <span className="text-xl font-mono font-semibold">Supervisor</span>
          <span className="text-sm text-muted-foreground">View analytics & metrics</span>
        </Button>
      </div>

      <div className="mt-16 flex items-center gap-2 text-muted-foreground text-sm">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span>System Online</span>
        <span className="mx-2">•</span>
        <span className="font-mono">4 Active Alerts</span>
      </div>
    </div>
  );
}
