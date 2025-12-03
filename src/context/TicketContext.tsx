import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Priority = 'critical' | 'high' | 'low';
export type Status = 'open' | 'in-progress' | 'resolved';

export interface Ticket {
  id: string;
  ticketNumber: number;
  machineName: string;
  zone: string;
  issueSummary: string;
  priority: Priority;
  status: Status;
  timestamp: Date;
  aiActionPlan?: string;
  reportedBy: string;
}

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'timestamp'>) => Ticket;
  updateTicketStatus: (id: string, status: Status) => void;
  getTicketsByStatus: (status: Status) => Ticket[];
  metrics: {
    activeDowntime: number;
    mttr: number;
    ticketsToday: number;
  };
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

// Mock data
const initialTickets: Ticket[] = [
  {
    id: '1',
    ticketNumber: 401,
    machineName: 'Conveyor Belt A3',
    zone: 'Zone A',
    issueSummary: 'Belt jam detected - debris accumulation',
    priority: 'high',
    status: 'in-progress',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    aiActionPlan: '1. Stop conveyor belt\n2. Clear debris from rollers\n3. Inspect belt tension\n4. Run test cycle',
    reportedBy: 'John D.',
  },
  {
    id: '2',
    ticketNumber: 402,
    machineName: 'Hydraulic Press #2',
    zone: 'Zone B',
    issueSummary: 'Hydraulic fluid leak at cylinder seal',
    priority: 'critical',
    status: 'open',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    aiActionPlan: '1. Isolate hydraulic system\n2. Depressurize line\n3. Replace cylinder seal\n4. Refill hydraulic fluid\n5. Pressure test',
    reportedBy: 'Sarah M.',
  },
  {
    id: '3',
    ticketNumber: 403,
    machineName: 'Robotic Arm R-7',
    zone: 'Zone C',
    issueSummary: 'Calibration drift - positioning error',
    priority: 'low',
    status: 'open',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    aiActionPlan: '1. Run diagnostic routine\n2. Recalibrate end effector\n3. Update position offsets\n4. Verify with test piece',
    reportedBy: 'Mike R.',
  },
  {
    id: '4',
    ticketNumber: 404,
    machineName: 'CNC Mill Unit 5',
    zone: 'Zone A',
    issueSummary: 'Unusual vibration during operation',
    priority: 'high',
    status: 'in-progress',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    aiActionPlan: '1. Check spindle bearings\n2. Inspect tool holder\n3. Verify workpiece clamping\n4. Run vibration analysis',
    reportedBy: 'Lisa K.',
  },
];

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [ticketCounter, setTicketCounter] = useState(405);

  const addTicket = useCallback((ticketData: Omit<Ticket, 'id' | 'ticketNumber' | 'timestamp'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: crypto.randomUUID(),
      ticketNumber: ticketCounter,
      timestamp: new Date(),
    };
    setTickets(prev => [newTicket, ...prev]);
    setTicketCounter(prev => prev + 1);
    return newTicket;
  }, [ticketCounter]);

  const updateTicketStatus = useCallback((id: string, status: Status) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === id ? { ...ticket, status } : ticket
      )
    );
  }, []);

  const getTicketsByStatus = useCallback((status: Status) => {
    return tickets.filter(ticket => ticket.status === status);
  }, [tickets]);

  const metrics = {
    activeDowntime: tickets.filter(t => t.status !== 'resolved').length * 23, // minutes
    mttr: 47, // minutes average
    ticketsToday: tickets.filter(t => {
      const today = new Date();
      return t.timestamp.toDateString() === today.toDateString();
    }).length,
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicketStatus, getTicketsByStatus, metrics }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
