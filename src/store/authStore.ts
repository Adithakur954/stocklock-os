import { create } from 'zustand';
import { User } from '@/lib/db';

export type BranchScope = number | 'all';

interface AuthState {
  user: User | null;
  selectedBranchId: BranchScope;
  login: (user: User) => void;
  logout: () => void;
  setSelectedBranchId: (branchId: BranchScope) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  selectedBranchId: 'all',
  login: (user) => set({ user, selectedBranchId: user.role === 'Owner' ? 'all' : user.branchId ?? 'all' }),
  logout: () => set({ user: null, selectedBranchId: 'all' }),
  setSelectedBranchId: (branchId) => set({ selectedBranchId: branchId }),
}));
