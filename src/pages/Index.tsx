import { useState } from 'react';
import { RoleSelector } from '@/components/RoleSelector';
import { OperationsView } from '@/views/OperationsView';
import { MaintenanceView } from '@/views/MaintenanceView';
import { SupervisorView } from '@/views/SupervisorView';
import { TicketProvider } from '@/context/TicketContext';

type Role = 'operations' | 'maintenance' | 'supervisor' | null;

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleBack = () => setSelectedRole(null);

  return (
    <TicketProvider>
      <div className="min-h-screen bg-background">
        {selectedRole === null && (
          <RoleSelector onSelectRole={setSelectedRole} />
        )}
        {selectedRole === 'operations' && (
          <OperationsView onBack={handleBack} />
        )}
        {selectedRole === 'maintenance' && (
          <MaintenanceView onBack={handleBack} />
        )}
        {selectedRole === 'supervisor' && (
          <SupervisorView onBack={handleBack} />
        )}
      </div>
    </TicketProvider>
  );
};

export default Index;
