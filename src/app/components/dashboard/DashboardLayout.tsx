'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold text-blue-600">Instagram DM ダッシュボード</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link href="/" className={`flex items-center px-4 py-3 ${isActive('/')}`}>
                <span className="ml-2">ダッシュボード</span>
              </Link>
            </li>
            <li>
              <Link href="/customers" className={`flex items-center px-4 py-3 ${isActive('/customers')}`}>
                <span className="ml-2">顧客一覧</span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className={`flex items-center px-4 py-3 ${isActive('/settings')}`}>
                <span className="ml-2">設定</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {pathname === '/' && 'ダッシュボード'}
              {pathname === '/customers' && '顧客一覧'}
              {pathname === '/settings' && '設定'}
            </h2>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
