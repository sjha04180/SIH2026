// src/app/student/passport/PassportClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  FileText, 
  ExternalLink, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle,
  Code,
  Calendar,
  Layers,
  ArrowRight,
  GraduationCap,
  Building,
  Info
} from 'lucide-react';

interface PassportClientProps {
  initialActivities: any[];
  initialProjects: any[];
  studentInfo: {
    name: string;
    rollNumber: string;
    cgpa: number;
    sgpa: number;
    attendance: number;
    program: string;
    department: string;
  };
}

export default function PassportClient({ initialActivities, initialProjects, studentInfo }: PassportClientProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'add-activity' | 'add-project'>('view');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const router = useRouter();

  // Activity Form State
  const [actType, setActType] = useState('Hackathon');
  const [actTitle, setActTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [actOrganiser, setActOrganiser] = useState('');
  const [actRole, setActRole] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actOutcome, setActOutcome] = useState('');
  const [actEvidenceUrl, setActEvidenceUrl] = useState('');
  const [actEvidenceType, setActEvidenceType] = useState('PDF');
  const [actExternalLink, setActExternalLink] = useState('');
  const [actLoading, setActLoading] = useState(false);
  const [actError, setActError] = useState('');

  // File upload state helpers
  const [uploadingAct, setUploadingAct] = useState(false);
  const [uploadedActName, setUploadedActName] = useState('');
  const [uploadingProj, setUploadingProj] = useState(false);
  const [uploadedProjName, setUploadedProjName] = useState('');

  // Project Form State
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStartDate, setProjStartDate] = useState('');
  const [projEndDate, setProjEndDate] = useState('');
  const [projRepoUrl, setProjRepoUrl] = useState('');
  const [projDemoUrl, setProjDemoUrl] = useState('');
  const [projEvidence, setProjEvidence] = useState('');
  const [projRole, setProjRole] = useState('');
  const [projCont, setProjCont] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projLoading, setProjLoading] = useState(false);
  const [projError, setProjError] = useState('');

  // Determine Verification Route Preview in real-time
  const getRoutePreview = (type: string) => {
    const eventTypes = ['Hackathon', 'Competition', 'Workshop', 'Seminar', 'Club/SIG Participation'];
    const facultyTypes = ['Project', 'Research', 'Internship', 'Award', 'Certification'];

    if (eventTypes.includes(type)) {
      return {
        route: 'Event/SIG Coordinator',
        desc: 'This activity requires verification from the designated Event Coordinator or Club head. Proof of participation/certificates must be uploaded.',
        style: 'bg-amber-50 text-amber-900 border-amber-200'
      };
    } else if (facultyTypes.includes(type)) {
      return {
        route: 'Faculty / Teacher Guardian',
        desc: 'This academic or high-impact record requires approval from your Teacher Guardian. Official verification links or project documents are highly recommended.',
        style: 'bg-indigo-50 text-indigo-900 border-indigo-200'
      };
    } else {
      return {
        route: 'Self-Declared — No Verification Queue',
        desc: 'Low-risk personal study or learning activities. No mandatory proof is required. This record will directly be added to your Passport as Self-Declared / Unverified.',
        style: 'bg-slate-100 text-slate-700 border-slate-300'
      };
    }
  };

  const routeInfo = getRoutePreview(actType);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
          </span>
        );
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
            <Clock className="w-3 h-3 mr-1" /> Pending Review
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wide">
            <AlertTriangle className="w-3 h-3 mr-1" /> Returned
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wide">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      case 'SELF_DECLARED':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
            <HelpCircle className="w-3 h-3 mr-1" /> Self-Declared
          </span>
        );
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'activity' | 'project') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === 'activity') {
      setUploadingAct(true);
      setUploadedActName('');
    } else {
      setUploadingProj(true);
      setUploadedProjName('');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');

      if (target === 'activity') {
        setActEvidenceUrl(data.url);
        setUploadedActName(data.fileName);
        // Automatically classify file type
        if (file.type === 'application/pdf') {
          setActEvidenceType('PDF');
        } else if (file.type.startsWith('image/')) {
          setActEvidenceType('Image');
        } else {
          setActEvidenceType('Document');
        }
      } else {
        setProjEvidence(data.url);
        setUploadedProjName(data.fileName);
      }
    } catch (err: any) {
      if (target === 'activity') {
        setActError(`File upload error: ${err.message}`);
      } else {
        setProjError(`File upload error: ${err.message}`);
      }
    } finally {
      if (target === 'activity') {
        setUploadingAct(false);
      } else {
        setUploadingProj(false);
      }
    }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setActError('');
    setActLoading(true);

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: actType,
          title: actTitle,
          date: actDate,
          organiser: actOrganiser,
          role: actRole,
          description: actDesc,
          outcome: actOutcome,
          evidenceUrl: actEvidenceUrl,
          evidenceType: actEvidenceType,
          externalLink: actExternalLink,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add activity');

      // Reset form
      setActTitle('');
      setActDate('');
      setActOrganiser('');
      setActRole('');
      setActDesc('');
      setActOutcome('');
      setActEvidenceUrl('');
      setActExternalLink('');
      
      setActiveTab('view');
      router.refresh();
    } catch (err: any) {
      setActError(err.message || 'Something went wrong.');
    } finally {
      setActLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjError('');
    setProjLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projName,
          projectDesc: projDesc,
          startDate: projStartDate,
          endDate: projEndDate,
          repoUrl: projRepoUrl,
          demoUrl: projDemoUrl,
          projectEvidence: projEvidence,
          role: projRole,
          contribution: projCont,
          technologies: projTech,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add project');

      // Reset form
      setProjName('');
      setProjDesc('');
      setProjStartDate('');
      setProjEndDate('');
      setProjRepoUrl('');
      setProjDemoUrl('');
      setProjEvidence('');
      setProjRole('');
      setProjCont('');
      setProjTech('');

      setActiveTab('view');
      router.refresh();
    } catch (err: any) {
      setProjError(err.message || 'Something went wrong.');
    } finally {
      setProjLoading(false);
    }
  };

  // Combine & Filter activities/projects
  const categorisedItems = [
    ...initialActivities.map(a => ({
      ...a,
      category: 'activity',
      displayDate: new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    })),
    ...initialProjects.map(c => ({
      ...c,
      id: c.id,
      title: c.projectName,
      type: 'Project Contribution',
      organiser: 'Academic / Personal',
      role: c.role,
      description: `Project: ${c.projectDesc}\nContribution: ${c.contribution}`,
      outcome: `Technologies: ${c.technologies}`,
      evidenceUrl: c.projectEvidence,
      evidenceType: c.projectEvidence ? 'PDF' : null,
      externalLink: c.repoUrl || c.demoUrl,
      verificationRoute: c.verificationRoute,
      status: c.status,
      reviewerName: c.reviewerName,
      reviewerComment: c.reviewerComment,
      category: 'project',
      displayDate: new Date(c.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }))
  ];

  const filteredItems = categorisedItems.filter(item => {
    // Category filter
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'technical' && !['Hackathon', 'Project Contribution', 'Project'].includes(item.type)) return false;
      if (categoryFilter === 'self-learning' && !['Self-learning'].includes(item.type)) return false;
      if (categoryFilter === 'co-curricular' && !['Workshop', 'Seminar', 'Competition', 'Club/SIG Participation'].includes(item.type)) return false;
      if (categoryFilter === 'achievements' && !['Award', 'Certification'].includes(item.type)) return false;
      if (categoryFilter === 'academic' && !['Internship', 'Research', 'Publication'].includes(item.type)) return false;
    }

    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Development Passport</h1>
          <p className="text-slate-500 text-xs mt-1">Capture, routing verification, and report dashboard.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'view' ? 'bg-white shadow-sm text-indigo-950 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Passport
          </button>
          <button
            onClick={() => setActiveTab('add-activity')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
              activeTab === 'add-activity' ? 'bg-white shadow-sm text-indigo-950 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Activity</span>
          </button>
          <button
            onClick={() => setActiveTab('add-project')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
              activeTab === 'add-project' ? 'bg-white shadow-sm text-indigo-950 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Project</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: VIEW PASSPORT */}
      {activeTab === 'view' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-900"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic (Internship/Research)</option>
                <option value="technical">Technical (Projects/Hackathons)</option>
                <option value="co-curricular">Co-curricular (Workshops/Seminars)</option>
                <option value="self-learning">Self-learning</option>
                <option value="achievements">Achievements & Awards</option>
              </select>

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-900"
              >
                <option value="all">All Statuses</option>
                <option value="VERIFIED">Verified</option>
                <option value="SUBMITTED">Pending Review</option>
                <option value="SELF_DECLARED">Self-Declared</option>
                <option value="RETURNED">Returned</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            
            <div className="text-xs text-slate-500 font-semibold">
              Showing {filteredItems.length} of {categorisedItems.length} total records
            </div>
          </div>

          {/* List of Cards */}
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              <Info className="w-8 h-8 mx-auto text-slate-400 mb-3" />
              <h3 className="font-bold text-slate-800 text-sm">No Passport Records Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try changing your filters or add your first development activity.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-white border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6 transition-all ${
                    item.status === 'VERIFIED' ? 'border-l-4 border-l-emerald-500 border-slate-200' :
                    item.status === 'RETURNED' ? 'border-l-4 border-l-orange-500 border-slate-200' :
                    item.status === 'REJECTED' ? 'border-l-4 border-l-red-500 border-slate-200' :
                    item.status === 'SELF_DECLARED' ? 'border-l-4 border-l-blue-400 border-slate-200' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-4 flex-1 min-w-0">
                    {/* Header line */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-250">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold font-mono">{item.displayDate}</span>
                      <div className="shrink-0">{getStatusBadge(item.status)}</div>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h3 className="text-base font-bold text-slate-950 truncate">{item.title}</h3>
                      <p className="text-xs text-slate-600 mt-2 whitespace-pre-line leading-relaxed">{item.description}</p>
                    </div>

                    {/* Meta info block */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-100 pt-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px] uppercase">Organiser / Source:</span>
                        <span className="font-semibold text-slate-700">{item.organiser}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold text-[10px] uppercase">My Role / Context:</span>
                        <span className="font-semibold text-slate-700">{item.role}</span>
                      </div>
                      {item.outcome && (
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">Outcome / Stack:</span>
                          <span className="font-semibold text-slate-700 truncate block">{item.outcome}</span>
                        </div>
                      )}
                    </div>

                    {/* Verification Log comment (Returned / Verified) */}
                    {item.reviewerComment && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                        <strong className="text-slate-900 block mb-0.5">
                          Review comment from {item.reviewerName || 'Reviewer'}:
                        </strong>
                        <p className="italic leading-relaxed">"{item.reviewerComment}"</p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Links */}
                  <div className="flex flex-col md:items-end justify-between shrink-0 gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    <div className="text-xs text-slate-400 font-semibold md:text-right">
                      <span className="block font-semibold text-[10px] uppercase tracking-wider">Verification Route</span>
                      <span className="text-slate-700 font-bold block mt-0.5">{item.verificationRoute.replace('_', ' ')}</span>
                    </div>

                    {/* Attachments / Links */}
                    <div className="flex flex-row md:flex-col gap-2.5">
                      {item.evidenceUrl && (
                        <a
                          href={item.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-bold text-indigo-900 hover:text-indigo-950 border border-indigo-150 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm bg-white"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          <span>View Evidence</span>
                        </a>
                      )}
                      {item.externalLink && (
                        <a
                          href={item.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm bg-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          <span>Visit URL</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: RECORD ACTIVITY */}
      {activeTab === 'add-activity' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Record a Development Activity</h2>
            <p className="text-xs text-slate-500 mt-1">All activities are classified dynamically to ensure verification goes only where needed.</p>
          </div>

          <form onSubmit={handleAddActivity} className="p-6 space-y-6">
            {actError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-700">
                {actError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Activity Type</label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value)}
                  className="bg-slate-50 border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Competition">Competition</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Club/SIG Participation">Club / SIG Participation</option>
                  <option value="Project">Project (Self/Hosted)</option>
                  <option value="Research">Research Work</option>
                  <option value="Internship">Internship</option>
                  <option value="Award">Award</option>
                  <option value="Certification">Certification</option>
                  <option value="YouTube Learning">YouTube Learning</option>
                  <option value="Self-study">Self-study / Tutorial</option>
                  <option value="Personal Practice">Personal Practice</option>
                  <option value="Unhosted Personal Project">Unhosted Personal Project</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Activity Title</label>
                <input
                  type="text"
                  required
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="e.g. MumbaiHacks 2026, React.js Complete Guide"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                />
              </div>

              {/* Organiser */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Organiser / Platform Source</label>
                <input
                  type="text"
                  required
                  value={actOrganiser}
                  onChange={(e) => setActOrganiser(e.target.value)}
                  placeholder="e.g. Mumbai Tech SIG, YouTube (Academind), TCS"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">My Role / Context</label>
                <input
                  type="text"
                  required
                  value={actRole}
                  onChange={(e) => setActRole(e.target.value)}
                  placeholder="e.g. Participant, Lead Frontend, Recipient, Self-learner"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date Completed</label>
                <input
                  type="date"
                  required
                  value={actDate}
                  onChange={(e) => setActDate(e.target.value)}
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                />
              </div>

              {/* External URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Optional external link</label>
                <input
                  type="url"
                  value={actExternalLink}
                  onChange={(e) => setActExternalLink(e.target.value)}
                  placeholder="e.g. GitHub Repository, Youtube Playlist Link"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description</label>
              <textarea
                required
                rows={3}
                value={actDesc}
                onChange={(e) => setActDesc(e.target.value)}
                placeholder="What did you learn or construct? Give solid context..."
                className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
              />
            </div>

            {/* Outcome */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Learning Outcome / Output</label>
              <input
                type="text"
                value={actOutcome}
                onChange={(e) => setActOutcome(e.target.value)}
                placeholder="e.g. Built a local blog, Learned custom state hooks, Won 2nd Runner Up"
                className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
              />
            </div>

            {/* Progressive routing box (VERY IMPORTANT!) */}
            <div className={`p-4 rounded-xl border flex gap-3.5 transition-all ${routeInfo.style}`}>
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">Verification Route: {routeInfo.route}</span>
                <p className="text-xs mt-1 leading-relaxed">{routeInfo.desc}</p>
              </div>
            </div>

            {/* Evidence fields - only display/make required if NOT self-declared */}
            {routeInfo.route !== 'Self-Declared — No Verification Queue' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider">Upload / Link Evidence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Upload File (PDF / Image)</label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleFileChange(e, 'activity')}
                      className="border border-slate-350 rounded-lg w-full px-3 py-1 text-xs text-slate-950 bg-white focus:outline-none cursor-pointer"
                    />
                    {uploadingAct && <span className="text-[10px] text-indigo-900 font-bold block mt-1 animate-pulse">Uploading file...</span>}
                    {uploadedActName && (
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                        ✓ Uploaded: {uploadedActName}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Evidence Type</label>
                    <select
                      value={actEvidenceType}
                      onChange={(e) => setActEvidenceType(e.target.value)}
                      className="border border-slate-350 rounded-lg w-full px-3 py-1.5 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="Image">Image File</option>
                      <option value="Document">Word Doc / Sheet</option>
                      <option value="URL">Verification Website Link</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 text-xs text-slate-600 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                <span>No mandatory proof required. This record will remain <strong>Self-Declared / Unverified</strong>.</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('view')}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actLoading}
                className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center"
              >
                {actLoading ? 'Submitting...' : 'Save Activity'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content 3: RECORD PROJECT CONTRIBUTION */}
      {activeTab === 'add-project' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Record a Team/Personal Project</h2>
            <p className="text-xs text-slate-500 mt-1">Differentiate the project itself from your specific contributions and tech stack.</p>
          </div>

          <form onSubmit={handleAddProject} className="p-6 space-y-6">
            {projError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-700">
                {projError}
              </div>
            )}

            {/* Project Context */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase text-indigo-900 tracking-wider flex items-center">
                <Layers className="w-4 h-4 mr-1.5" /> Project Metadata
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="e.g. Smart Campus Platform, Decentralised Booking Portal"
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Overall Project Description</label>
                  <textarea
                    required
                    rows={2}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Describe what the overall system accomplishes..."
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={projStartDate}
                    onChange={(e) => setProjStartDate(e.target.value)}
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={projEndDate}
                    onChange={(e) => setProjEndDate(e.target.value)}
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Repository URL (optional)</label>
                  <input
                    type="url"
                    value={projRepoUrl}
                    onChange={(e) => setProjRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Demo URL (optional)</label>
                  <input
                    type="url"
                    value={projDemoUrl}
                    onChange={(e) => setProjDemoUrl(e.target.value)}
                    placeholder="https://smartcampus.demo..."
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Individual Contribution */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-xs uppercase text-indigo-900 tracking-wider flex items-center">
                <Code className="w-4 h-4 mr-1.5" /> My Individual Contribution
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">My Role in Project</label>
                    <input
                      type="text"
                      required
                      value={projRole}
                      onChange={(e) => setProjRole(e.target.value)}
                      placeholder="e.g. Backend Developer, Team Lead"
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Technologies/Skills Used</label>
                    <input
                      type="text"
                      required
                      value={projTech}
                      onChange={(e) => setProjTech(e.target.value)}
                      placeholder="Comma-separated stack, e.g. Node.js, Express, PostgreSQL"
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">My Specific Contribution & Work Details</label>
                  <textarea
                    required
                    rows={3}
                    value={projCont}
                    onChange={(e) => setProjCont(e.target.value)}
                    placeholder="Describe exactly what code/architecture you built (e.g. Designed REST APIs, created PostgreSQL schema, implemented oauth flow)..."
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Upload Project Evidence File (optional)</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'project')}
                    className="border border-slate-350 rounded-lg w-full px-3 py-1 text-xs text-slate-950 bg-white focus:outline-none cursor-pointer"
                  />
                  {uploadingProj && <span className="text-[10px] text-indigo-900 font-bold block mt-1 animate-pulse">Uploading file...</span>}
                  {uploadedProjName && (
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                      ✓ Uploaded: {uploadedProjName}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Routing indicator */}
            <div className="p-4 rounded-xl border bg-indigo-50 border-indigo-200 text-indigo-900 flex gap-3.5">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">Verification Route: Faculty / Teacher Guardian</span>
                <p className="text-xs mt-1 leading-relaxed">
                  Project records and specific student code contributions are automatically routed to your assigned Faculty Advisor or Teacher Guardian for official institutional review.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('view')}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={projLoading}
                className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center"
              >
                {projLoading ? 'Submitting...' : 'Save Project Contribution'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
