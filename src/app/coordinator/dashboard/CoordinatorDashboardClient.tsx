// src/app/coordinator/dashboard/CoordinatorDashboardClient.tsx
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
  Users,
  X,
  Award,
  Info
} from 'lucide-react';

interface CoordinatorDashboardClientProps {
  initialActivities: any[];
  coordinatorScope: string;
}

export default function CoordinatorDashboardClient({ 
  initialActivities, 
  coordinatorScope 
}: CoordinatorDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const router = useRouter();

  // Sort activities
  const sortedActivities = [...initialActivities].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Group activities by event name (Title)
  const groupedEvents: { [key: string]: any[] } = {};
  sortedActivities.forEach(act => {
    const key = act.title;
    if (!groupedEvents[key]) {
      groupedEvents[key] = [];
    }
    groupedEvents[key].push(act);
  });

  // Filter groups based on whether they contain pending or history items
  const eventGroups = Object.keys(groupedEvents).map(title => {
    const list = groupedEvents[title];
    const pending = list.filter(item => item.status === 'SUBMITTED' || item.status === 'UNDER_REVIEW');
    const history = list.filter(item => ['VERIFIED', 'RETURNED', 'REJECTED'].includes(item.status));
    
    return {
      title,
      organiser: list[0]?.organiser || '',
      date: new Date(list[0]?.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      pending,
      history,
      all: list
    };
  });

  const activeGroups = eventGroups.filter(group => {
    if (activeTab === 'pending') {
      return group.pending.length > 0;
    } else {
      return group.history.length > 0;
    }
  });

  const handleAction = async (action: 'VERIFY' | 'RETURN' | 'REJECT') => {
    if (!selectedActivity) return;

    if (action !== 'VERIFY' && !comment.trim()) {
      setActionError('A comment is required when returning or rejecting an activity.');
      return;
    }

    setActionError('');
    setActionLoading(true);

    try {
      const response = await fetch(`/api/activities/${selectedActivity.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, comment }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to process decision');

      setComment('');
      setSelectedActivity(null);
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
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 uppercase">
            Verified
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-150 uppercase">
            Returned
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-150 uppercase">
            Rejected
          </span>
        );
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-150 uppercase">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Event Verifications Dashboard</h1>
          <p className="text-slate-500 text-xs mt-1">Review co-curricular hackathons, club participations, and workshops.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => { setActiveTab('pending'); setSelectedActivity(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pending' ? 'bg-white shadow-sm text-indigo-950 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Verifications
          </button>
          <button
            onClick={() => { setActiveTab('history'); setSelectedActivity(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history' ? 'bg-white shadow-sm text-indigo-950 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Verification History
          </button>
        </div>
      </div>

      {/* Main Grid: Split events list and inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left/Middle: Event List Grouping (Col span 2 if inspector is open) */}
        <div className={`space-y-6 ${selectedActivity ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {activeGroups.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              <Users className="w-8 h-8 mx-auto text-slate-400 mb-3" />
              <h3 className="font-bold text-slate-800 text-sm">No Pending Event Verifications</h3>
              <p className="text-xs text-slate-500 mt-1">All co-curricular submissions are currently up to date.</p>
            </div>
          ) : (
            activeGroups.map((group) => {
              const activeList = activeTab === 'pending' ? group.pending : group.history;
              return (
                <div key={group.title} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  {/* Event Info Header */}
                  <div className="bg-slate-50 p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-indigo-900" />
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{group.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Organiser: <span className="font-semibold">{group.organiser}</span> &bull; Event Date: {group.date}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-50 border border-indigo-150 text-[10px] uppercase tracking-wide font-extrabold text-indigo-900 self-start sm:self-auto">
                      Event / SIG Verification Route
                    </span>
                  </div>

                  {/* Participants table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                      <thead className="bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3">Participant Student</th>
                          <th className="px-6 py-3">Role In Event</th>
                          <th className="px-6 py-3">Outcome</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Review</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 font-medium text-slate-800">
                        {activeList.map(act => (
                          <tr 
                            key={act.id} 
                            className={`hover:bg-slate-50/50 transition-colors ${selectedActivity?.id === act.id ? 'bg-indigo-50/40' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <div>
                                <span className="font-bold text-slate-900 block">{act.student.user.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{act.student.rollNumber}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 truncate max-w-[150px] font-semibold text-slate-700">
                              {act.role}
                            </td>
                            <td className="px-6 py-4 truncate max-w-[200px] text-slate-500 font-medium">
                              {act.outcome || '-'}
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(act.status)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setSelectedActivity(act)}
                                className="inline-flex items-center text-[11px] font-bold text-indigo-900 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Participant Inspector Drawer */}
        {selectedActivity && (
          <div className="bg-white border border-indigo-900/10 rounded-2xl shadow-md p-6 space-y-6 lg:col-span-1 relative animate-in fade-in-50 duration-200">
            {/* Close button */}
            <button 
              onClick={() => setSelectedActivity(null)} 
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded">
                Participant Details
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-2 truncate pr-6">{selectedActivity.student.user.name}</h3>
              <p className="text-slate-400 text-xs font-mono mt-0.5">Roll No: {selectedActivity.student.rollNumber}</p>
            </div>

            {/* Info details */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Event Name</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{selectedActivity.title}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Participant Role</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedActivity.role}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Event Date</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {new Date(selectedActivity.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Description of Contribution</span>
                <p className="text-slate-600 leading-relaxed mt-1 whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedActivity.description}
                </p>
              </div>

              {selectedActivity.outcome && (
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide">Event Outcome / Awards</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedActivity.outcome}</span>
                </div>
              )}
            </div>

            {/* Evidence attachment display */}
            {(selectedActivity.evidenceUrl || selectedActivity.externalLink) && (
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wide mb-1">Uploaded Certificates</span>
                <div className="flex flex-wrap gap-2">
                  {selectedActivity.evidenceUrl && (
                    <a
                      href={selectedActivity.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-indigo-900 hover:text-indigo-950 border border-indigo-150 px-3 py-1.5 rounded-lg bg-white shadow-sm shrink-0"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      <span>View Certificate</span>
                    </a>
                  )}
                  {selectedActivity.externalLink && (
                    <a
                      href={selectedActivity.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-sm shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      <span>Event URL</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Form */}
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
                  This co-curricular record was updated to <span className="font-bold text-slate-700">{selectedActivity.status}</span>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
