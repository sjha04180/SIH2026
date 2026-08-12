// src/app/faculty/dashboard/FacultyDashboardClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  FileText, 
  ExternalLink, 
  MessageSquare,
  ShieldCheck,
  User,
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';

interface FacultyDashboardClientProps {
  initialActivities: any[];
  initialContributions: any[];
  facultyName: string;
}

export default function FacultyDashboardClient({ 
  initialActivities, 
  initialContributions, 
  facultyName 
}: FacultyDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const router = useRouter();

  // Combine items and sort
  const allItems = [
    ...initialActivities.map(a => ({
      ...a,
      itemType: 'activity',
      displayDate: new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      submittedDate: new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    })),
    ...initialContributions.map(c => ({
      ...c,
      itemType: 'project',
      title: c.projectName,
      type: 'Project Contribution',
      organiser: 'Academic / Team',
      role: c.role,
      description: c.projectDesc,
      displayDate: new Date(c.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      submittedDate: new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Filter items
  const pendingItems = allItems.filter(item => item.status === 'SUBMITTED' || item.status === 'UNDER_REVIEW');
  const historyItems = allItems.filter(item => ['VERIFIED', 'RETURNED', 'REJECTED'].includes(item.status));

  const currentList = activeTab === 'pending' ? pendingItems : historyItems;

  const handleAction = async (action: 'VERIFY' | 'RETURN' | 'REJECT') => {
    if (!selectedItem) return;
    
    // Require comments for Return or Reject
    if (action !== 'VERIFY' && !comment.trim()) {
      setActionError('A comment is required when returning or rejecting an activity.');
      return;
    }

    setActionError('');
    setActionLoading(true);

    const apiPath = selectedItem.itemType === 'activity' 
      ? `/api/activities/${selectedItem.id}/verify`
      : `/api/projects/${selectedItem.id}/verify`;

    try {
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, comment }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process decision');

      setComment('');
      setSelectedItem(null);
      router.refresh();
    } catch (err: any) {
      setActionError(err.message || 'Something went wrong.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Returned
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wide">
            <XCircle className="w-3.5 h-3.5 mr-1" /> Rejected
          </span>
        );
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5 mr-1" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Verification Queue</h1>
          <p className="text-slate-500 text-xs mt-1">Review student activities, projects, and role contributions.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => { setActiveTab('pending'); setSelectedItem(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeTab === 'pending' ? 'bg-white shadow-sm text-indigo-950 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending Requests</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'pending' ? 'bg-indigo-900 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {pendingItems.length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab('history'); setSelectedItem(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history' ? 'bg-white shadow-sm text-indigo-950 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action History ({historyItems.length})
          </button>
        </div>
      </div>

      {/* Main Grid: Split List and Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* List of items (Col span 2) */}
        <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${selectedItem ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Record Type</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                {currentList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No records found in this queue.
                    </td>
                  </tr>
                ) : (
                  currentList.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${selectedItem?.id === item.id ? 'bg-indigo-50/40 hover:bg-indigo-50/60' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-55 text-indigo-900 flex items-center justify-center font-bold font-sans">
                            {item.student.user.name[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{item.student.user.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.student.rollNumber}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 uppercase text-[10px] font-extrabold tracking-wider text-slate-500">
                        {item.type}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800 truncate max-w-xs">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono">
                        {item.submittedDate}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="inline-flex items-center text-xs font-bold text-indigo-900 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Item Detail Inspector Panel (Col span 1) */}
        {selectedItem && (
          <div className="bg-white border border-indigo-900/10 rounded-2xl shadow-md p-6 space-y-6 lg:col-span-1 relative animate-in fade-in-50 duration-200">
            {/* Close button */}
            <button 
              onClick={() => setSelectedItem(null)} 
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Inspector Header */}
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded">
                Review Inspector
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-2 truncate pr-6">{selectedItem.title}</h3>
              <p className="text-slate-400 text-xs font-mono mt-0.5">Submitted: {selectedItem.submittedDate}</p>
            </div>

            {/* Student context box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-full bg-indigo-900 text-white flex items-center justify-center font-bold">
                {selectedItem.student.user.name[0]}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-sm text-slate-900 block truncate">{selectedItem.student.user.name}</span>
                <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{selectedItem.student.rollNumber}</span>
                <p className="text-[11px] text-slate-500 truncate mt-1">
                  {selectedItem.student.program.code} &bull; Sem {selectedItem.student.currentSemester}
                </p>
              </div>
            </div>

            {/* Activity details content */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Activity Type</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block uppercase">{selectedItem.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Role / Context</span>
                <span className="font-semibold text-slate-800 block mt-0.5">{selectedItem.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Organiser / Platform Source</span>
                <span className="font-semibold text-slate-800 block mt-0.5">{selectedItem.organiser}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Dates</span>
                <span className="font-semibold text-slate-800 block mt-0.5">{selectedItem.displayDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Description / Context</span>
                <p className="text-slate-600 leading-relaxed mt-1 whitespace-pre-line">{selectedItem.description}</p>
              </div>

              {/* Special project individual contribution display */}
              {selectedItem.itemType === 'project' && (
                <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-3">
                  <div>
                    <span className="text-indigo-900 block font-bold text-[10px] uppercase tracking-wide">Technologies / Skill Stack</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {selectedItem.technologies.split(',').map((tech: string) => (
                        <span key={tech} className="bg-white border border-indigo-150 text-indigo-900 px-2 py-0.5 rounded text-[10px] font-bold">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-indigo-900 block font-bold text-[10px] uppercase tracking-wide">My Individual Contribution</span>
                    <p className="text-indigo-950 font-semibold leading-relaxed mt-1 whitespace-pre-line">
                      {selectedItem.contribution}
                    </p>
                  </div>
                </div>
              )}

              {selectedItem.outcome && selectedItem.itemType !== 'project' && (
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Learning Outcome / Output</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedItem.outcome}</span>
                </div>
              )}
            </div>

            {/* Evidence attachment display */}
            {(selectedItem.evidenceUrl || selectedItem.externalLink) && (
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide mb-1">Attached Evidence</span>
                <div className="flex flex-wrap gap-2">
                  {selectedItem.evidenceUrl && (
                    <a
                      href={selectedItem.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-indigo-900 hover:text-indigo-950 border border-indigo-150 px-3 py-1.5 rounded-lg bg-white shadow-sm shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      <span>View Document</span>
                    </a>
                  )}
                  {selectedItem.externalLink && (
                    <a
                      href={selectedItem.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-sm shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      <span>Visit URL</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Decision Form (Only for pending queue) */}
            {activeTab === 'pending' ? (
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1.5 text-indigo-900" /> Process Decision
                </h4>

                {actionError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded text-[11px] text-red-700">
                    {actionError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Reviewer Comments</label>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter approval feedback or request clarification details..."
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAction('REJECT')}
                    disabled={actionLoading}
                    className="py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction('RETURN')}
                    disabled={actionLoading}
                    className="py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Return
                  </button>
                  <button
                    onClick={() => handleAction('VERIFY')}
                    disabled={actionLoading}
                    className="py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-100 pt-4 text-xs text-slate-500">
                <span className="block font-bold text-[10px] uppercase tracking-wide">Review Completed</span>
                <p className="mt-1 leading-relaxed">
                  This activity was reviewed and updated to <span className="font-bold text-slate-700">{selectedItem.status}</span>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
