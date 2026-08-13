// src/app/student/profile/ProfileClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Info, 
  Save, 
  Globe,
  Briefcase
} from 'lucide-react';

interface ProfileLink {
  id: string;
  platformName: string;
  profileUrl: string;
}

interface Student {
  id: string;
  rollNumber: string;
  batch: string;
  currentSemester: number;
  profileSummary: string | null;
  interests: string | null;
  program: { name: string };
  department: { name: string };
  profileLinks: ProfileLink[];
}

interface ProfileClientProps {
  student: Student;
  sessionName: string;
  sessionEmail: string;
}

export default function ProfileClient({ student, sessionName, sessionEmail }: ProfileClientProps) {
  const [profileSummary, setProfileSummary] = useState(student.profileSummary || '');
  const [interests, setInterests] = useState(student.interests || '');
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Profile Link Form State
  const [platformName, setPlatformName] = useState('LinkedIn');
  const [profileUrl, setProfileUrl] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  const router = useRouter();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveSuccess(false);
    setProfileError('');

    try {
      const response = await fetch('/api/student/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileSummary, interests }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update profile');

      setSaveSuccess(true);
      router.refresh();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setProfileError(err.message || 'Something went wrong.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim()) {
      setLinkError('Please enter a profile link.');
      return;
    }

    setLinkLoading(true);
    setLinkError('');

    try {
      const response = await fetch('/api/student/profile-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platformName, profileUrl }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save link');

      setProfileUrl('');
      router.refresh();
    } catch (err: any) {
      setLinkError(err.message || 'Failed to add link.');
    } finally {
      setLinkLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to remove this profile link?')) return;

    try {
      const response = await fetch('/api/student/profile-links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete link');

      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove link.');
    }
  };

  const platforms = [
    'LinkedIn', 'GitHub', 'GitLab', 'LeetCode', 'CodeChef', 
    'Codeforces', 'HackerRank', 'Kaggle', 'Hugging Face', 
    'ORCID', 'Google Scholar', 'Personal Website', 'Portfolio', 'Other'
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-xs mt-1">Manage biography summary, professional links, and view institutional records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Official Context Card */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 bg-indigo-900 rounded-full text-white flex items-center justify-center font-bold text-lg">
                {sessionName[0]}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-tight">{sessionName}</h3>
                <span className="text-xs text-slate-400 font-mono tracking-wider">{student.rollNumber}</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Department</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{student.department.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Program</span>
                <span className="font-semibold text-slate-800 mt-0.5 block">{student.program.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Batch</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{student.batch}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Semester</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">Sem {student.currentSemester}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Institutional Email</span>
                <span className="font-semibold text-slate-800 mt-0.5 block font-mono">{sessionEmail}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[10px] text-slate-500 leading-relaxed flex gap-2">
              <Info className="w-4 h-4 text-indigo-900 shrink-0 mt-0.5" />
              <span>Identity values are locked and managed by HOD Registrar office.</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Edit Form & Links */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Biography & Interests */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center">
                <Briefcase className="w-4 h-4 mr-1.5 text-indigo-900" /> Biography & Development Profile
              </h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              {profileError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded text-xs text-red-700">
                  {profileError}
                </div>
              )}
              {saveSuccess && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-2.5 rounded text-xs text-emerald-700">
                  ✓ Biography updated successfully!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Profile Summary / Bio</label>
                <textarea
                  rows={4}
                  value={profileSummary}
                  onChange={(e) => setProfileSummary(e.target.value)}
                  placeholder="Enter a brief background summary (e.g. Aspiring Full Stack Engineer interested in cloud scale architectures...)"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Academic / Professional Interests</label>
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. Distributed Systems, Decentralized Apps, Mobile UI design"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                />
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center cursor-pointer disabled:opacity-60"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Professional Profile Links */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-indigo-900" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Professional Profile Links</h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-slate-500">
              <Info className="w-4 h-4 text-indigo-900 shrink-0 mt-0.5" />
              <span>
                **Platform Link Rules:** Links are simple URLs for reference and inclusion in your Passport report ledger. Antigravity does **not** request account credentials or attempt API calls or page scraping.
              </span>
            </div>

            {/* Link Add Form */}
            <form onSubmit={handleAddLink} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-slate-50/50 p-4 border border-slate-200 rounded-xl">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-2">Platform</label>
                <select
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="bg-white border border-slate-350 rounded-lg w-full px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                >
                  {platforms.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-2">Profile Link URL</label>
                  <input
                    type="url"
                    required
                    value={profileUrl}
                    onChange={(e) => setProfileUrl(e.target.value)}
                    placeholder="https://..."
                    className="border border-slate-350 rounded-lg w-full px-3 py-1.5 text-xs text-slate-900 focus:outline-none bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={linkLoading}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-bold shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
                >
                  {linkLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
              {linkError && (
                <p className="col-span-3 text-[10px] text-red-600 font-bold mt-1">{linkError}</p>
              )}
            </form>

            {/* Link Listing */}
            <div className="space-y-3">
              {student.profileLinks.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center">No profile links added yet.</p>
              ) : (
                student.profileLinks.map(link => (
                  <div key={link.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs">
                    <div className="min-w-0 pr-4">
                      <span className="font-extrabold text-slate-900 block uppercase tracking-wide text-[10px]">{link.platformName}</span>
                      <a 
                        href={link.profileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-mono text-slate-500 font-semibold hover:underline flex items-center gap-1 mt-1 truncate"
                      >
                        <span>{link.profileUrl}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-1.5 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-650 hover:border-red-150 rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
