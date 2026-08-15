// src/app/principal/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, Award, LogOut } from 'lucide-react';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function PrincipalLayout({ children }: LayoutProps) {
  const session = await getSession();

  if (!session || session.role !== 'PRINCIPAL') {
    redirect('/login');
  }

  const navItems = [
    { name: 'Principal Dashboard', href: '/principal', icon: LayoutDashboard },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-slate-100 flex flex-col justify-between border-r border-indigo-900 hidden md:flex shrink-0">
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-indigo-900 flex items-center space-x-3">
            <img src="/logo.png" alt="StudentSetu Logo" className="w-8 h-8 rounded-lg object-contain bg-white p-0.5" />
            <div>
              <span className="font-bold text-sm leading-tight block">StudentSetu</span>
              <span className="text-xs text-indigo-300">Principal Portal</span>
            </div>
          </div>

          {/* User Card */}
          <div className="p-5 border-b border-indigo-900 bg-indigo-950/50">
            <h4 className="font-bold text-sm text-white truncate">{session.name}</h4>
            <p className="text-xs text-indigo-300 uppercase font-semibold tracking-wider mt-0.5">Principal / Executive Authority</p>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-indigo-900/60 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-indigo-900 bg-indigo-950/30">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-400 hover:text-white hover:bg-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="bg-indigo-950 text-white p-4 flex items-center justify-between md:hidden border-b border-indigo-900">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="StudentSetu Logo" className="w-6 h-6 rounded-md object-contain bg-white p-0.5" />
            <span className="font-bold text-sm">StudentSetu</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-semibold bg-indigo-900 px-2.5 py-1 rounded-full uppercase tracking-wider text-indigo-200">
              Principal
            </span>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="text-indigo-300 hover:text-white">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Main page children */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
