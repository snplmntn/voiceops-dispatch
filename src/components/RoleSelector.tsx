import { HardHat, Wrench, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleSelectorProps {
  onSelectRole: (role: 'operations' | 'maintenance' | 'supervisor') => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:p-6">
      <div className="text-center mb-8 sm:mb-12 animate-fade-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-foreground mb-2 sm:mb-3">
          <span className="text-accent">Tick</span>Track
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">Smart Manufacturing Dispatch</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 w-full max-w-4xl">
        <Button
          variant="role"
          onClick={() => onSelectRole('operations')}
          className="group animate-fade-up py-6 sm:py-8"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
            <HardHat className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
          </div>
          <span className="text-lg sm:text-xl font-mono font-semibold">Operations</span>
          <span className="text-xs sm:text-sm text-muted-foreground">Report issues via voice</span>
        </Button>

        <Button
          variant="role"
          onClick={() => onSelectRole('maintenance')}
          className="group animate-fade-up py-6 sm:py-8"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Wrench className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <span className="text-lg sm:text-xl font-mono font-semibold">Maintenance</span>
          <span className="text-xs sm:text-sm text-muted-foreground">Manage active tickets</span>
        </Button>

        <Button
          variant="role"
          onClick={() => onSelectRole('supervisor')}
          className="group animate-fade-up py-6 sm:py-8 sm:col-span-2 md:col-span-1"
          style={{ animationDelay: '0.3s' }}
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-success/20 flex items-center justify-center group-hover:bg-success/30 transition-colors">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-success" />
          </div>
          <span className="text-lg sm:text-xl font-mono font-semibold">Supervisor</span>
          <span className="text-xs sm:text-sm text-muted-foreground">View analytics & metrics</span>
        </Button>
      </div>

      <div className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-2 text-muted-foreground text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span>System Online</span>
        </div>
        <span className="mx-1 sm:mx-2">•</span>
        <span className="font-mono">4 Active Alerts</span>
      </div>
    </div>
  );
}
