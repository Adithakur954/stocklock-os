'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { db, User } from '@/lib/db';
import { KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  useEffect(() => {
    async function loadUsers() {
      const allUsers = await db.users.toArray();
      setUsers(allUsers);
    }
    loadUsers();
  }, []);

  const handleLogin = (user: User) => {
    login(user);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
            <KeyRound size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">StockLock OS</h1>
          <p className="text-sm text-gray-500">Select an account to continue</p>
        </div>

        <div className="space-y-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user)}
              className="w-full rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50"
            >
              <div className="font-medium text-gray-900">{user.username}</div>
              <div className="text-sm text-gray-500">{user.role} {user.branchId ? `(Branch ID: ${user.branchId})` : ''}</div>
            </button>
          ))}
          {users.length === 0 && (
            <div className="text-center text-sm text-gray-500">Loading users...</div>
          )}
        </div>
      </div>
    </div>
  );
}
