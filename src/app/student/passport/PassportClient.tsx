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
  Info,
  Globe,
  Tag
} from 'lucide-react';

interface PassportClientProps {
  initialActivities: any[];
  initialProjects: any[];
  profileLinks: any[];
  studentSkills: any[];
  studentInfo: {
    name: string;
    rollNumber: string;
    cgpa: number;
    sgpa: number;
    attendance: number;
    program: string;
    department: string;
    profileSummary: string | null;
    interests: string | null;
  };
}

export default function PassportClient({ 
  initialActivities, 
  initialProjects, 
  profileLinks, 
  studentSkills, 
  studentInfo 
}: PassportClientProps) {
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
        style: 'bg-amber-50 text-amber-900 border-amber-250'
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
        style: 'bg-slate-100 text-slate-700 border-slate-355'
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

    // File validation: PDF, JPG, JPEG, PNG, WEBP and size limit (5MB)
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, JPEG, PNG, or WEBP evidence files are allowed.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Evidence file size must not exceed 5MB.');
      e.target.value = '';
      return;
    }

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

      // Reset
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

      // Reset
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

  // Combine & Filter
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
      organiser: 'Academic / Team',
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
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'technical' && !['Hackathon', 'Project Contribution', 'Project'].includes(item.type)) return false;
      if (categoryFilter === 'self-learning' && !['Self-learning', 'YouTube Learning', 'Self-study', 'Personal Practice', 'Unhosted Personal Project'].includes(item.type)) return false;
      if (categoryFilter === 'co-curricular' && !['Workshop', 'Seminar', 'Competition', 'Club/SIG Participation'].includes(item.type)) return false;
      if (categoryFilter === 'achievements' && !['Award', 'Certification'].includes(item.type)) return false;
      if (categoryFilter === 'academic' && !['Internship', 'Research', 'Publication'].includes(item.type)) return false;
    }
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Profile Header Passport style */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-slate-100 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 bg-indigo-900/60 px-3 py-1 rounded-full border border-indigo-850">
                Official Passport Records
              </span>
              <span className="text-xs font-mono text-slate-400">Roll: {studentInfo.rollNumber}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-3 tracking-tight">
              {studentInfo.name}
            </h2>
            <p className="text-slate-350 text-xs md:text-sm mt-1">
              {studentInfo.program} &bull; {studentInfo.department}
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">CGPA</span>
              <span className="text-2xl font-extrabold text-white block mt-0.5">{studentInfo.cgpa.toFixed(2)}</span>
            </div>
            <div className="w-px bg-slate-850 h-8 shrink-0" />
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Attendance</span>
              <span className="text-2xl font-extrabold text-white block mt-0.5">{studentInfo.attendance.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Profile Summary Bio */}
        {studentInfo.profileSummary && (
          <div className="border-t border-slate-850 pt-4 text-xs text-slate-300 leading-relaxed max-w-2xl whitespace-pre-line">
            <span className="block font-bold text-[9px] uppercase tracking-wider text-slate-400 mb-1.5">Profile Summary</span>
            "{studentInfo.profileSummary}"
          </div>
        )}

        {/* Profile Links & Skills Badges */}
        <div className="flex flex-col md:flex-row justify-between border-t border-slate-850 pt-4 gap-4 text-xs">
          
          {/* Profile Links */}
          <div className="space-y-2 flex-1">
            <span className="block font-bold text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> Professional links
            </span>
            <div className="flex flex-wrap gap-2">
              {profileLinks.length === 0 ? (
                <span className="text-slate-500 italic text-[11px]">No links uploaded. Add links in profile page.</span>
              ) : (
                profileLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1 rounded-lg text-slate-300 transition-colors hover:text-white"
                  >
                    <span className="font-semibold text-[10px] uppercase">{link.platformName}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                ))
              )}
            </div>
          </div>

          {/* Technical Skills declarations */}
          <div className="space-y-2 flex-1 border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6">
            <span className="block font-bold text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-400" /> Declared Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {studentSkills.length === 0 ? (
                <span className="text-slate-500 italic text-[11px]">No skills declared. Manage in skills page.</span>
              ) : (
                studentSkills.map(stSk => (
                  <span
                    key={stSk.id}
                    className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold ${
                      stSk.status === 'VERIFIED'
                        ? 'bg-emerald-950/60 border-emerald-900 text-emerald-300'
                        : 'bg-slate-850 border-slate-800 text-slate-300'
                    }`}
                  >
                    {stSk.skill.name} &bull; {stSk.level}
                  </span>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Development Ledger</h2>
          <p className="text-slate-500 text-xs mt-1">Audit trail of all activities, hackathons, and certifications.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'view' ? 'bg-white shadow-sm text-indigo-950 font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Passport Ledger
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

      {/* Tab 1: VIEW PASSPORT */}
      {activeTab === 'view' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-55 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic (Internships/Research)</option>
                <option value="technical">Technical (Projects/Hackathons)</option>
                <option value="co-curricular">Co-curricular (Workshops/Seminars)</option>
                <option value="self-learning">Self-learning / Online study</option>
                <option value="achievements">Achievements & Awards</option>
              </select>

              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-55 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none"
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
              Ledger displays {filteredItems.length} records
            </div>
          </div>

          {/* Cards List */}
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              <Info className="w-8 h-8 mx-auto text-slate-400 mb-3" />
              <h3 className="font-bold text-slate-800 text-sm">No Ledger Records Found</h3>
              <p className="text-xs text-slate-500 mt-1">Try changing filters or submit another developmental record.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-white border rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between gap-6 transition-all ${
                    item.status === 'VERIFIED' ? 'border-l-4 border-l-emerald-500' :
                    item.status === 'RETURNED' ? 'border-l-4 border-l-orange-500' :
                    item.status === 'REJECTED' ? 'border-l-4 border-l-red-500' :
                    item.status === 'SELF_DECLARED' ? 'border-l-4 border-l-blue-400' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-4 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-250">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold font-mono">{item.displayDate}</span>
                      <div className="shrink-0">{getStatusBadge(item.status)}</div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-950 truncate">{item.title}</h3>
                      <p className="text-xs text-slate-655 mt-2 whitespace-pre-line leading-relaxed">{item.description}</p>
                    </div>

                    {/* Technological badges for projects */}
                    {item.type === 'Project Contribution' && item.technologies && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.technologies.split(',').map((tech: string) => (
                          <span key={tech} className="inline-flex items-center bg-indigo-50 border border-indigo-150 text-indigo-900 px-2 py-0.5 rounded text-[10px] font-bold">
                            <Tag className="w-2.5 h-2.5 mr-1 text-indigo-400" />
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-100 pt-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Organiser / Platform</span>
                        <span className="font-semibold text-slate-700">{item.organiser}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">My Role</span>
                        <span className="font-semibold text-slate-700">{item.role}</span>
                      </div>
                      {item.outcome && (
                        <div>
                          <span className="text-slate-400 block font-bold text-[9px] uppercase">Outcome / Summary</span>
                          <span className="font-semibold text-slate-700 truncate block">{item.outcome}</span>
                        </div>
                      )}
                    </div>

                    {item.reviewerComment && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700">
                        <strong className="text-slate-900 block mb-0.5">
                          Review feedback from {item.reviewerName || 'Reviewer'}:
                        </strong>
                        <p className="italic leading-relaxed">"{item.reviewerComment}"</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end justify-between shrink-0 gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                    <div className="text-xs text-slate-400 font-semibold md:text-right">
                      <span className="block font-bold text-[9px] uppercase tracking-wider">Verification Route</span>
                      <span className="text-slate-700 font-bold block mt-0.5">{item.verificationRoute.replace('_', ' ')}</span>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2">
                      {item.evidenceUrl && (
                        <a
                          href={item.evidenceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-bold text-indigo-900 hover:text-indigo-950 border border-indigo-150 px-3 py-1.5 rounded-lg bg-white shadow-sm shrink-0"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          <span>View Proof</span>
                        </a>
                      )}
                      {item.externalLink && (
                        <a
                          href={item.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-sm shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          <span>Visit link</span>
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

      {/* Tab 2: ADD ACTIVITY */}
      {activeTab === 'add-activity' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Record a Development Activity</h2>
            <p className="text-xs text-slate-500 mt-1">All activities are routed to specific verification authorities based on category config.</p>
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
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Activity Category</label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value)}
                  className="bg-slate-50 border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Competition">Competition</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Club/SIG Participation">Club / SIG Participation</option>
                  <option value="Project">Project (hosted)</option>
                  <option value="Research">Research paper</option>
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
                  placeholder="e.g. Smart Campus Dev, Advanced Python Tutorial"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
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
                  placeholder="e.g. ACM chapter, Coursera, Youtube channel name"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">My Role</label>
                <input
                  type="text"
                  required
                  value={actRole}
                  onChange={(e) => setActRole(e.target.value)}
                  placeholder="e.g. Lead dev, Attendee, Self-study student"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
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
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                />
              </div>

              {/* External URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">External Reference URL (optional)</label>
                <input
                  type="url"
                  value={actExternalLink}
                  onChange={(e) => setActExternalLink(e.target.value)}
                  placeholder="https://..."
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description</label>
              <textarea
                required
                rows={3}
                value={actDesc}
                onChange={(e) => setActDesc(e.target.value)}
                placeholder="Details of skills acquired, tools used..."
                className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Learning Outcome</label>
              <input
                type="text"
                value={actOutcome}
                onChange={(e) => setActOutcome(e.target.value)}
                placeholder="e.g. Created local repository sandbox, received certified badge"
                className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
              />
            </div>

            {/* Routing indicator */}
            <div className={`p-4 rounded-xl border flex gap-3.5 transition-all ${routeInfo.style}`}>
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">Verification Route: {routeInfo.route}</span>
                <p className="text-xs mt-1 leading-relaxed">{routeInfo.desc}</p>
              </div>
            </div>

            {/* Evidence File Upload */}
            {routeInfo.route !== 'Self-Declared — No Verification Queue' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider">Upload / Link Evidence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Upload File (PDF / Image &bull; Max 5MB)</label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={(e) => handleFileChange(e, 'activity')}
                      className="border border-slate-350 rounded-lg w-full px-3 py-1 text-xs text-slate-950 bg-white cursor-pointer"
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
                      <option value="PDF">PDF Certificate</option>
                      <option value="Image">Image File</option>
                      <option value="Document">Word Document</option>
                      <option value="URL">Verification Link</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 text-xs text-slate-655 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                <span>No proof required. This self-declared entry will directly be added to your ledger.</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('view')}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actLoading}
                className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                {actLoading ? 'Saving...' : 'Save Activity'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: ADD PROJECT */}
      {activeTab === 'add-project' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-900">Record a Team/Personal Project</h2>
            <p className="text-xs text-slate-500 mt-1">Specify overall metadata and details of your specific contribution.</p>
          </div>

          <form onSubmit={handleAddProject} className="p-6 space-y-6">
            {projError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-700">
                {projError}
              </div>
            )}

            {/* Project Metadata */}
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
                    placeholder="e.g. Smart Campus Booking Portal"
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Overall Project Description</label>
                  <textarea
                    required
                    rows={2}
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Describe what the overall project accomplishes..."
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hosting/Demo URL (optional &bull; Hosting is not a prerequisite)</label>
                  <input
                    type="url"
                    value={projDemoUrl}
                    onChange={(e) => setProjDemoUrl(e.target.value)}
                    placeholder="https://..."
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
                      placeholder="e.g. Backend Dev, Database Lead"
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
                    placeholder="Describe exactly what code/modules you built (designed APIs, schema migration)..."
                    className="border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Upload Project Documentation/Screenshot (optional &bull; Max 5MB)</label>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={(e) => handleFileChange(e, 'project')}
                    className="border border-slate-350 rounded-lg w-full px-3 py-1 text-xs text-slate-950 bg-white cursor-pointer"
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

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('view')}
                className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={projLoading}
                className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                {projLoading ? 'Saving...' : 'Save Project Contribution'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
