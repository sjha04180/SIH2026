// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, User, ShieldAlert, Award, FileText, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setError('');

    const targetEmail = customEmail || email;
    const targetPassword = customPassword || password;

    if (!targetEmail || !targetPassword) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(targetEmail);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect based on role
      const role = data.user.role;
      if (role === 'STUDENT') {
        router.push('/student/dashboard');
      } else if (role === 'FACULTY') {
        router.push('/faculty/dashboard');
      } else if (role === 'COORDINATOR') {
        router.push('/coordinator/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (role === 'PRINCIPAL') {
        router.push('/principal');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  const demoUsers = [
    {
      name: 'Sachin Jha',
      role: 'STUDENT',
      email: 'sachin@sih.edu',
      password: 'sachin123',
      desc: 'View Passport, submit React Self-Learning, Hackathon & Smart Campus Project.',
    },
    {
      name: 'Dr. Alok Ranjan',
      role: 'FACULTY / TG',
      email: 'alok@sih.edu',
      password: 'faculty123',
      desc: 'Verify Projects, individual contributions, achievements, and internships.',
    },
    {
      name: 'Prof. Neha Sharma',
      role: 'EVENT / SIG COORD',
      email: 'neha@sih.edu',
      password: 'coord123',
      desc: 'Verify SIG club participation, workshops, and hackathons (e.g., MumbaiHacks).',
    },
    {
      name: 'Dr. Rajesh Patil',
      role: 'ADMIN / HOD',
      email: 'hod.cse@sih.edu',
      password: 'admin123',
      desc: 'View department-wide statistics, program analytics, and search student passports.',
    },
    {
      name: 'Dr. Shruti Sharma',
      role: 'PRINCIPAL',
      email: 'principal@sih.edu',
      password: 'principal123',
      desc: 'Institutional restricted read-only executive overview and audit search portal.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-900 text-white rounded-xl shadow-md mb-4">
          <School className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Development Passport
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
          A centralized, evidence-aware, and appropriately verified student development record.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700 flex items-start">
              <ShieldAlert className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={(e) => handleLogin(e)}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Institutional Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-900 focus:border-indigo-900 text-slate-900 text-sm"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-900 focus:border-indigo-900 text-slate-900 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading !== null}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-indigo-900 hover:bg-indigo-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-900 transition-colors disabled:opacity-60"
              >
                {loading === email ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
              Quick Sandbox Access for Judges
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoUsers.map((user) => (
            <button
              key={user.email}
              onClick={() => handleLogin(undefined, user.email, user.password)}
              disabled={loading !== null}
              className="bg-white p-4 border border-slate-200 rounded-xl text-left hover:border-indigo-900 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group disabled:opacity-60 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wide">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2 font-mono">{user.email}</p>
                <p className="text-xs text-slate-600 leading-relaxed pr-2">{user.desc}</p>
              </div>

              <div className="mt-4 flex items-center justify-between w-full border-t border-slate-100 pt-3 text-xs text-indigo-900 font-bold group-hover:text-indigo-950">
                <span>
                  {loading === user.email ? 'Authenticating...' : 'Enter Sandbox'}
                </span>
                {loading === user.email ? (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-950" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-slate-400">
        <p>SIH 2026 Problem Statement — SIH25093 MVP</p>
        <p className="mt-1 font-semibold text-slate-500">Capture Once. Classify Correctly. Verify Where Required. Reuse Everywhere.</p>
      </div>
    </main>
  );
}
