// src/app/student/passport/PassportClient.tsx
'use client';

import { useState, useEffect } from 'react';
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
  Tag,
  ArrowLeft,
  Users,
  Check,
  BookOpen,
  Award
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

  // Wizard Steps Tracking
  const [actStep, setActStep] = useState<number>(1);
  const [projStep, setProjStep] = useState<number>(1);

  // Parse tabs and filters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const statusParam = params.get('status');
      if (tabParam === 'add-activity') {
        setActiveTab('add-activity');
        setActStep(1);
      } else if (tabParam === 'add-project') {
        setActiveTab('add-project');
        setProjStep(1);
      } else if (tabParam === 'view') {
        setActiveTab('view');
      }
      if (statusParam) {
        setStatusFilter(statusParam);
      }
    }
  }, []);

  const handleCancelWizard = (type: 'activity' | 'project') => {
    if (type === 'activity') {
      if (actTitle || actOrganiser || actDesc) {
        if (!confirm('Are you sure you want to abandon this activity wizard? All entered progress will be lost.')) {
          return;
        }
      }
      // Reset activity states
      setActTitle('');
      setActDate('');
      setActOrganiser('');
      setActRole('');
      setActDesc('');
      setActOutcome('');
      setActEvidenceUrl('');
      setUploadedActName('');
      setActExternalLink('');
      setActStep(1);
      setActiveTab('view');
    } else {
      if (projName || projDesc || projCont) {
        if (!confirm('Are you sure you want to abandon this project wizard? All entered progress will be lost.')) {
          return;
        }
      }
      // Reset project states
      setProjName('');
      setProjDesc('');
      setProjStartDate('');
      setProjEndDate('');
      setProjRepoUrl('');
      setProjDemoUrl('');
      setProjEvidence('');
      setUploadedProjName('');
      setProjRole('');
      setProjCont('');
      setProjTech('');
      setProjStep(1);
      setActiveTab('view');
    }
  };

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
      setActStep(5);
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
      setProjStep(5);
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

      {/* Tab 2: ADD ACTIVITY WIZARD */}
      {activeTab === 'add-activity' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add Activity Workflow</h2>
              <p className="text-xs text-slate-500 mt-1">Record co-curricular or technical work for your StudentSetu Passport.</p>
            </div>
            {actStep < 5 && (
              <button
                type="button"
                onClick={() => handleCancelWizard('activity')}
                className="text-xs font-bold text-red-650 hover:underline self-start sm:self-center"
              >
                Abandon Wizard
              </button>
            )}
          </div>

          <div className="p-6">
            {/* Stepper Progress Indicator */}
            {actStep < 5 && (
              <div className="flex items-center justify-between max-w-xl mx-auto mb-8 font-semibold text-xs text-slate-500">
                {['Type', 'Details', 'Evidence', 'Review'].map((step, idx) => {
                  const stepNum = idx + 1;
                  const isActive = actStep === stepNum;
                  const isCompleted = actStep > stepNum;
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-initial">
                      <div className="flex items-center space-x-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold border transition-all ${
                          isActive 
                            ? 'bg-indigo-900 border-indigo-900 text-white shadow-sm ring-4 ring-indigo-50' 
                            : isCompleted 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'bg-white border-slate-300 text-slate-400'
                        }`}>
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                        </div>
                        <span className={`hidden sm:inline ${isActive ? 'text-indigo-950 font-bold' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                      {idx < 3 && (
                        <div className={`flex-1 h-0.5 mx-4 transition-all ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {actError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-700 mb-6">
                {actError}
              </div>
            )}

            {/* STEP 1: ACTIVITY TYPE */}
            {actStep === 1 && (
              <div className="space-y-6">
                <div className="text-center max-w-md mx-auto">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">What did you do?</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Select the activity category below. We will customize the details required based on your selection.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {[
                    { value: 'Hackathon', label: 'Hackathon', desc: 'Collaborative development hack events, prototype building, and pitches.', icon: Award },
                    { value: 'Competition', label: 'Competition', desc: 'Academic, coding, or departmental challenges.', icon: Tag },
                    { value: 'Workshop', label: 'Workshop / Seminar', desc: 'Attending technical presentations, bootcamps, or training.', icon: Layers },
                    { value: 'Internship', label: 'Internship', desc: 'Industry training, work experiences, or research positions.', icon: Building },
                    { value: 'Club/SIG Participation', label: 'Club / SIG Activity', desc: 'Active participation or officer leadership roles in interest groups.', icon: Users },
                    { value: 'Certification', label: 'Certification', desc: 'Acquiring industry certifications (AWS, Coursera, Oracle, etc).', icon: FileText },
                    { value: 'Self-study', label: 'Self-Learning', desc: 'Non-credited personal study, tutorials, or YouTube learning.', icon: GraduationCap },
                    { value: 'Other', label: 'Other Activities', desc: 'Any other co-curricular activity or personal development.', icon: HelpCircle }
                  ].map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => {
                          setActType(c.value);
                          setActStep(2);
                        }}
                        className={`text-left p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                          actType === c.value 
                            ? 'bg-indigo-50 border-indigo-900 text-indigo-950 shadow-sm ring-1 ring-indigo-900/10' 
                            : 'bg-white border-slate-205 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${actType === c.value ? 'bg-indigo-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs uppercase tracking-wider text-slate-800">{c.label}</h5>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{c.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: DETAILS */}
            {actStep === 2 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Enter Activity Details</h3>
                  <p className="text-xs text-slate-500 mt-1">Please provide details regarding the selected category ({actType}).</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {actType === 'Hackathon' ? 'Hackathon Name' : actType === 'Internship' ? 'Internship Title' : 'Activity Title'}
                    </label>
                    <input
                      type="text"
                      value={actTitle}
                      onChange={(e) => setActTitle(e.target.value)}
                      placeholder={actType === 'Hackathon' ? 'e.g. Smart Campus Dev' : actType === 'Internship' ? 'e.g. Frontend Intern' : 'e.g. Advanced Python Tutorial'}
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {actType === 'Hackathon' ? 'Organizer' : actType === 'Internship' ? 'Company Name' : 'Organizer / Source'}
                    </label>
                    <input
                      type="text"
                      value={actOrganiser}
                      onChange={(e) => setActOrganiser(e.target.value)}
                      placeholder={actType === 'Hackathon' ? 'e.g. ACM chapter' : actType === 'Internship' ? 'e.g. Google' : 'e.g. Coursera'}
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date Completed</label>
                    <input
                      type="date"
                      value={actDate}
                      onChange={(e) => setActDate(e.target.value)}
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {actType === 'Certification' ? 'Credential ID (optional)' : 'My Role'}
                    </label>
                    <input
                      type="text"
                      value={actRole}
                      onChange={(e) => setActRole(e.target.value)}
                      placeholder={actType === 'Hackathon' ? 'e.g. Lead dev' : actType === 'Certification' ? 'e.g. AWS-123' : 'e.g. Attendee'}
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Learning Outcome / Achievements</label>
                    <input
                      type="text"
                      value={actOutcome}
                      onChange={(e) => setActOutcome(e.target.value)}
                      placeholder="e.g. Developed REST APIs, 1st place prize, certification credential"
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Detailed Description</label>
                    <textarea
                      rows={3}
                      value={actDesc}
                      onChange={(e) => setActDesc(e.target.value)}
                      placeholder="Describe what you learned, libraries used, or tasks completed..."
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActStep(1)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (actTitle && actOrganiser && actRole && actDate && actDesc) {
                        setActError('');
                        setActStep(3);
                      } else {
                        setActError('Please fill in all required fields (Title, Organizer, Role, Date, and Description).');
                      }
                    }}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: EVIDENCE */}
            {actStep === 3 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Attach Verification Proof</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Evidence helps verification, but not every activity requires a certificate.
                  </p>
                </div>

                {routeInfo.route !== 'Self-Declared — No Verification Queue' ? (
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Upload Certificate File (PDF / Image &bull; Max 5MB)</label>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg,.webp"
                            onChange={(e) => handleFileChange(e, 'activity')}
                            className="border border-slate-350 rounded-lg w-full px-3 py-1.5 text-xs text-slate-950 bg-white cursor-pointer"
                          />
                          {uploadingAct && <span className="text-[10px] text-indigo-900 font-bold block mt-1 animate-pulse">Uploading file...</span>}
                          {uploadedActName && (
                            <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                              ✓ Uploaded: {uploadedActName}
                            </span>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2">Evidence Type</label>
                          <select
                            value={actEvidenceType}
                            onChange={(e) => setActEvidenceType(e.target.value)}
                            className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                          >
                            <option value="PDF">PDF Certificate</option>
                            <option value="Image">Image File</option>
                            <option value="Document">Word Document</option>
                            <option value="URL">Verification Link</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Verification URL / Reference Link (optional)</label>
                      <input
                        type="url"
                        value={actExternalLink}
                        onChange={(e) => setActExternalLink(e.target.value)}
                        placeholder="https://verify.credentials.com/..."
                        className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start space-x-3.5">
                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 text-xs block uppercase tracking-wider">Self-Declared Record</span>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        This activity can be recorded as Self-Declared. A certificate is not required.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActStep(2)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActError('');
                      setActStep(4);
                    }}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW */}
            {actStep === 4 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Review & Submit</h3>
                  <p className="text-xs text-slate-500 mt-1">Please inspect your record before final submission.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Activity Category</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{actType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Completion Date</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{actDate}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Activity Title</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{actTitle}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Organizer / Source</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{actOrganiser}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">My Role</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{actRole}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Learning Outcome</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{actOutcome || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Description</span>
                    <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed whitespace-pre-line">{actDesc}</p>
                  </div>
                  {(actEvidenceUrl || actExternalLink) && (
                    <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-4">
                      {actEvidenceUrl && (
                        <div>
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Uploaded File</span>
                          <span className="font-semibold text-indigo-900 mt-0.5 block">{uploadedActName || 'evidence.pdf'}</span>
                        </div>
                      )}
                      {actExternalLink && (
                        <div>
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Verification Link</span>
                          <a href={actExternalLink} target="_blank" rel="noreferrer" className="text-indigo-900 hover:underline mt-0.5 block truncate max-w-xs">{actExternalLink}</a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={`p-4 rounded-xl border flex gap-3.5 ${routeInfo.style}`}>
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm block">Verification Route: {routeInfo.route}</span>
                    <p className="text-xs mt-1 leading-relaxed">
                      {routeInfo.route === 'Self-Declared — No Verification Queue' 
                        ? 'This self-study item does not go into review. It is saved directly to your ledger.' 
                        : `This activity will be routed to the ${routeInfo.route} for review and validation.`}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddActivity} className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActStep(3)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={actLoading}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    {actLoading ? 'Saving...' : 'Submit Activity'}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 5: SUCCESS */}
            {actStep === 5 && (
              <div className="max-w-md mx-auto text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Activity Recorded</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Your activity has been successfully recorded in your StudentSetu Passport ledger.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-700">
                  Initial Status: {routeInfo.route === 'Self-Declared — No Verification Queue' ? (
                    <span className="text-blue-700">Self-Declared (Saved)</span>
                  ) : (
                    <span className="text-amber-700">Pending Review</span>
                  )}
                </div>
                <div className="flex justify-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setActStep(1);
                      setActiveTab('view');
                    }}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    View Passport Ledger
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset states
                      setActTitle('');
                      setActDate('');
                      setActOrganiser('');
                      setActRole('');
                      setActDesc('');
                      setActOutcome('');
                      setActEvidenceUrl('');
                      setUploadedActName('');
                      setActExternalLink('');
                      setActStep(1);
                    }}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Record Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: ADD PROJECT WIZARD */}
      {activeTab === 'add-project' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Record a Team/Personal Project</h2>
              <p className="text-xs text-slate-500 mt-1">Specify overall metadata and details of your specific contribution.</p>
            </div>
            {projStep < 5 && (
              <button
                type="button"
                onClick={() => handleCancelWizard('project')}
                className="text-xs font-bold text-red-655 text-red-650 hover:underline self-start sm:self-center"
              >
                Abandon Wizard
              </button>
            )}
          </div>

          <div className="p-6 animate-in fade-in duration-200">
            {/* Stepper Progress */}
            {projStep < 5 && (
              <div className="flex items-center justify-between max-w-xl mx-auto mb-8 font-semibold text-xs text-slate-500">
                {['Project Details', 'Your Contribution', 'Evidence', 'Review'].map((step, idx) => {
                  const stepNum = idx + 1;
                  const isActive = projStep === stepNum;
                  const isCompleted = projStep > stepNum;
                  return (
                    <div key={step} className="flex items-center flex-1 last:flex-initial">
                      <div className="flex items-center space-x-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold border transition-all ${
                          isActive 
                            ? 'bg-indigo-900 border-indigo-900 text-white shadow-sm ring-4 ring-indigo-50' 
                            : isCompleted 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'bg-white border-slate-300 text-slate-400'
                        }`}>
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
                        </div>
                        <span className={`hidden sm:inline ${isActive ? 'text-indigo-950 font-bold' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                      {idx < 3 && (
                        <div className={`flex-1 h-0.5 mx-4 transition-all ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {projError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-700 mb-6">
                {projError}
              </div>
            )}

            {/* STEP 1: PROJECT DETAILS */}
            {projStep === 1 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center">
                    <Layers className="w-4 h-4 mr-1.5 text-indigo-900" /> Overall Project Details
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Specify overall metadata of your personal build or team repository.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={projName}
                      onChange={(e) => setProjName(e.target.value)}
                      placeholder="e.g. Smart Campus Booking Portal"
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-2">Overall Project Description</label>
                    <textarea
                      rows={2}
                      value={projDesc}
                      onChange={(e) => setProjDesc(e.target.value)}
                      placeholder="Describe what the overall system accomplishes..."
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={projStartDate}
                      onChange={(e) => setProjStartDate(e.target.value)}
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">End Date (or Target Completion)</label>
                    <input
                      type="date"
                      value={projEndDate}
                      onChange={(e) => setProjEndDate(e.target.value)}
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (projName && projDesc && projStartDate && projEndDate) {
                        setProjError('');
                        setProjStep(2);
                      } else {
                        setProjError('Please enter the project name, description, and start/end dates.');
                      }
                    }}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: YOUR CONTRIBUTION */}
            {projStep === 2 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center">
                    <Code className="w-4 h-4 mr-1.5 text-indigo-900" /> My Individual Contribution
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Specify what **you** individually coded or designed. Do not claim team work as solo contribution.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">My Specific Role in Project</label>
                      <input
                        type="text"
                        value={projRole}
                        onChange={(e) => setProjRole(e.target.value)}
                        placeholder="e.g. Backend Dev, Database Lead"
                        className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Technologies / Skills Used</label>
                      <input
                        type="text"
                        value={projTech}
                        onChange={(e) => setProjTech(e.target.value)}
                        placeholder="e.g. React, Express, PostgreSQL"
                        className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">My Specific Contribution & Work Details</label>
                    <textarea
                      rows={3}
                      value={projCont}
                      onChange={(e) => setProjCont(e.target.value)}
                      placeholder="Describe exactly what code modules, schemas, or components you built..."
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProjStep(1)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (projRole && projTech && projCont) {
                        setProjError('');
                        setProjStep(3);
                      } else {
                        setProjError('Please specify your project role, tech stack, and individual contribution.');
                      }
                    }}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: EVIDENCE */}
            {projStep === 3 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center">
                    <Globe className="w-4 h-4 mr-1.5 text-indigo-900" /> Project Reference Links & Files
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Provide links or upload documentation to aid review (optional).</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Repository URL (GitHub/GitLab)</label>
                    <input
                      type="url"
                      value={projRepoUrl}
                      onChange={(e) => setProjRepoUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Hosting / Live Demo URL</label>
                    <input
                      type="url"
                      value={projDemoUrl}
                      onChange={(e) => setProjDemoUrl(e.target.value)}
                      placeholder="https://demo.platform.com"
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-2">Upload Documentation / Screenshots (Max 5MB)</label>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp"
                      onChange={(e) => handleFileChange(e, 'project')}
                      className="border border-slate-350 rounded-lg w-full px-3 py-1.5 text-xs text-slate-950 bg-white cursor-pointer"
                    />
                    {uploadingProj && <span className="text-[10px] text-indigo-900 font-bold block mt-1 animate-pulse">Uploading file...</span>}
                    {uploadedProjName && (
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                        ✓ Uploaded: {uploadedProjName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProjStep(2)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjStep(4)}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW */}
            {projStep === 4 && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Review & Route Project</h3>
                  <p className="text-xs text-slate-500 mt-1">Verify details before final validation routing.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Project Name</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{projName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Start Date</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{projStartDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">End Date</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{projEndDate}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Project Description</span>
                    <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">{projDesc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">My Role</span>
                      <span className="font-semibold text-indigo-950 mt-0.5 block">{projRole}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Tech Stack</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">{projTech}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">My Individual Contribution</span>
                    <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed whitespace-pre-line">{projCont}</p>
                  </div>
                  {(projEvidence || projRepoUrl || projDemoUrl) && (
                    <div className="pt-3 border-t border-slate-200 flex flex-wrap gap-4">
                      {projEvidence && (
                        <div>
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Documentation File</span>
                          <span className="font-semibold text-indigo-900 mt-0.5 block">{uploadedProjName || 'project_docs.pdf'}</span>
                        </div>
                      )}
                      {projRepoUrl && (
                        <div>
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Repository</span>
                          <a href={projRepoUrl} target="_blank" rel="noreferrer" className="text-indigo-900 hover:underline mt-0.5 block truncate max-w-xs">{projRepoUrl}</a>
                        </div>
                      )}
                      {projDemoUrl && (
                        <div>
                          <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Live Demo</span>
                          <a href={projDemoUrl} target="_blank" rel="noreferrer" className="text-indigo-900 hover:underline mt-0.5 block truncate max-w-xs">{projDemoUrl}</a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl border bg-indigo-50 border-indigo-200 text-indigo-900 flex gap-3.5">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-sm block">Verification Route: Faculty / Teacher Guardian</span>
                    <p className="text-xs mt-1 leading-relaxed">
                      Project records and specific student code contributions are automatically routed to your assigned Faculty Advisor or Teacher Guardian for official institutional review.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleAddProject} className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setProjStep(3)}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={projLoading}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    {projLoading ? 'Saving...' : 'Submit Project Record'}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 5: SUCCESS */}
            {projStep === 5 && (
              <div className="max-w-md mx-auto text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Project Contribution Saved</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Your software project build details and specific technical contribution have been recorded.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-semibold text-slate-700">
                  Initial Status: <span className="text-amber-700">Pending Review (Faculty Advisor)</span>
                </div>
                <div className="flex justify-center space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setProjStep(1);
                      setActiveTab('view');
                    }}
                    className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50"
                  >
                    View Passport Ledger
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Reset states
                      setProjName('');
                      setProjDesc('');
                      setProjStartDate('');
                      setProjEndDate('');
                      setProjRepoUrl('');
                      setProjDemoUrl('');
                      setProjEvidence('');
                      setUploadedProjName('');
                      setProjRole('');
                      setProjCont('');
                      setProjTech('');
                      setProjStep(1);
                    }}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
                  >
                    Record Another Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
