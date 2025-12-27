/**
 * Dashboard-related types for board member dashboard
 */

export type XogosStatistics = {
  accounts: number;
  activeUsers: number;
  totalHours: number;
  lastUpdated: string;
  updatedBy: string;
};

export type XogosFinancials = {
  revenue: number;
  expenses: number;
  monthlyPayments: number;
  yearlyPayments: number;
  lifetimeMembers: number;
  lastUpdated: string;
  updatedBy: string;
};

export type ChecklistItem = {
  id: string;
  userId: string;
  task: string;
  completed: boolean;
  createdAt: string;
  createdBy: string;
};

export type BoardMemberProfile = {
  userId: string;
  rssTopic: string;
};
