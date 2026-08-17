// src/app/student/reports/ReportClient.tsx
'use client';

import { useState } from 'react';
import { Printer, Award, CheckSquare, Info, Globe, Code, Check, Settings, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ReportClientProps {
  student: any;
  sessionName: string;
}

export default function ReportClient({ student, sessionName }: ReportClientProps) {
  const { activities, contributions, profileLinks = [], studentSkills = [], profileSummary } = student;

  // Stepper Wizard states
  const [repStep, setRepStep] = useState<number>(1); // 1: Configure, 2: Preview & Export
  const [incAcademic, setIncAcademic] = useState(true);
  const [incVerified, setIncVerified] = useState(true);
  const [incSelfDeclared, setIncSelfDeclared] = useState(true);
  const [incProjects, setIncProjects] = useState(true);
  const [incLinks, setIncLinks] = useState(true);
  const [incSkills, setIncSkills] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'VERIFIED_ONLY' | 'ALL'>('ALL');

  // Counts
  const totalActivities = activities.length + contributions.length;
  const verifiedActivities = activities.filter((a: any) => a.status === 'VERIFIED');
  const verifiedContributions = contributions.filter((c: any) => c.status === 'VERIFIED');
  const verifiedCount = verifiedActivities.length + verifiedContributions.length;

  const pendingCount = 
    activities.filter((a: any) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length +
    contributions.filter((c: any) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;

  const selfDeclaredCount = activities.filter((a: any) => a.status === 'SELF_DECLARED').length;

  // Combine items chronologically for timeline
  const allTimelineItems = [
    ...activities.map((a: any) => ({
      title: a.title,
      type: a.type,
      date: new Date(a.date),
      organiser: a.organiser,
      role: a.role,
      description: a.description,
      outcome: a.outcome,
      status: a.status,
      route: a.verificationRoute,
      category: 'Activity'
    })),
    ...contributions.map((c: any) => ({
      title: c.projectName,
      type: 'Project Contribution',
      date: new Date(c.startDate),
      organiser: 'Academic / Team',
      role: c.role,
      description: `Overall Project: ${c.projectDesc}\nMy Contribution: ${c.contribution}`,
      outcome: `Technologies used: ${c.technologies}`,
      status: c.status,
      route: c.verificationRoute,
      category: 'Project'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const filteredTimelineItems = allTimelineItems.filter(item => {
    // Check status
    if (statusFilter === 'VERIFIED_ONLY' && item.status !== 'VERIFIED' && item.status !== 'SELF_DECLARED') {
      return false;
    }
    // Check category
    if (item.category === 'Activity') {
      if (item.status === 'SELF_DECLARED') {
        return incSelfDeclared;
      }
      return incVerified;
    }
    if (item.category === 'Project') {
      return incProjects;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans p-4">
      {/* Stepper Progress */}
      <div className="flex items-center justify-between max-w-md mx-auto mb-8 font-semibold text-xs text-slate-500 print:hidden">
        {['Configure Report', 'Preview & Export'].map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = repStep === stepNum;
          const isCompleted = repStep > stepNum;
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
              {idx === 0 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all ${isCompleted ? 'bg-emerald-400' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {repStep === 1 ? (
        /* STEP 1: CONFIGURE WIZARD */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-indigo-900" /> Configure Report PDF
            </h2>
            <p className="text-xs text-slate-500 mt-1">Select the sections and filters to customize your official printed transcript record.</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Include Sections</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-start p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-x-3 text-xs font-semibold text-slate-800">
                <input type="checkbox" checked={incAcademic} onChange={(e) => setIncAcademic(e.target.checked)} className="rounded text-indigo-900 focus:ring-indigo-900 w-4 h-4 mt-0.5" />
                <div>
                  <span className="block font-bold">Academic Overview</span>
                  <span className="text-[10px] text-slate-400 font-normal">GPA (CGPA/SGPA), semester and batch.</span>
                </div>
              </label>

              <label className="flex items-start p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-x-3 text-xs font-semibold text-slate-800">
                <input type="checkbox" checked={incVerified} onChange={(e) => setIncVerified(e.target.checked)} className="rounded text-indigo-900 focus:ring-indigo-900 w-4 h-4 mt-0.5" />
                <div>
                  <span className="block font-bold">Verified Co-Curricular</span>
                  <span className="text-[10px] text-slate-400 font-normal">Hackathons, internships, certifications.</span>
                </div>
              </label>

              <label className="flex items-start p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-x-3 text-xs font-semibold text-slate-800">
                <input type="checkbox" checked={incSelfDeclared} onChange={(e) => setIncSelfDeclared(e.target.checked)} className="rounded text-indigo-900 focus:ring-indigo-900 w-4 h-4 mt-0.5" />
                <div>
                  <span className="block font-bold">Self-Declared Learning</span>
                  <span className="text-[10px] text-slate-400 font-normal">Personal practice, tutorials, self-studies.</span>
                </div>
              </label>

              <label className="flex items-start p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-x-3 text-xs font-semibold text-slate-800">
                <input type="checkbox" checked={incProjects} onChange={(e) => setIncProjects(e.target.checked)} className="rounded text-indigo-900 focus:ring-indigo-900 w-4 h-4 mt-0.5" />
                <div>
                  <span className="block font-bold">Team & Personal Projects</span>
                  <span className="text-[10px] text-slate-400 font-normal">Software builds and student role details.</span>
                </div>
              </label>

              <label className="flex items-start p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-x-3 text-xs font-semibold text-slate-800">
                <input type="checkbox" checked={incLinks} onChange={(e) => setIncLinks(e.target.checked)} className="rounded text-indigo-900 focus:ring-indigo-900 w-4 h-4 mt-0.5" />
                <div>
                  <span className="block font-bold">Professional Profiles</span>
                  <span className="text-[10px] text-slate-400 font-normal">LinkedIn, GitHub links references.</span>
                </div>
              </label>

              <label className="flex items-start p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer space-x-3 text-xs font-semibold text-slate-800">
                <input type="checkbox" checked={incSkills} onChange={(e) => setIncSkills(e.target.checked)} className="rounded text-indigo-900 focus:ring-indigo-900 w-4 h-4 mt-0.5" />
                <div>
                  <span className="block font-bold">Cataloged Skills Profile</span>
                  <span className="text-[10px] text-slate-400 font-normal">Technical skills with verification tags.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Record Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="border border-slate-350 rounded-lg w-full max-w-sm px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
            >
              <option value="ALL">Show All Records (Pending & Verified)</option>
              <option value="VERIFIED_ONLY">Verified Only (Strict Transcript Mode)</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setRepStep(2)}
              className="inline-flex items-center px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Preview PDF Report <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: PREVIEW & PRINT */
        <div className="space-y-6">
          {/* Print Instructions Box - Hides during printing */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 print:hidden shadow-sm animate-in fade-in duration-200">
            <Info className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950 leading-relaxed w-full">
              <strong className="block mb-0.5 font-bold">Print-Ready Digital Document</strong>
              Click the **Print / Export Report** button below to open the browser's native PDF printer window. The styles are optimized to hide navigation components, generating a clean transcript.
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="inline-flex items-center px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg font-bold text-xs shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  <span>Print / Export Report</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRepStep(1)}
                  className="inline-flex items-center px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-lg font-bold text-xs shadow-sm hover:bg-slate-50 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  <span>Change Customization</span>
                </button>
                <Link 
                  href="/student/dashboard" 
                  className="text-indigo-900 hover:underline font-bold"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Official Report Container */}
          <div className="bg-white border border-slate-350 p-8 sm:p-12 shadow-sm rounded-2xl print:border-none print:shadow-none print:p-0 print:m-0 space-y-8 animate-in zoom-in-95 duration-200">
            
            {/* Certificate Style Header */}
            <div className="text-center space-y-3 pb-6 border-b-2 border-slate-900">
              <h2 className="text-2xl font-extrabold text-slate-950 tracking-wide uppercase">
                SIH Institute of Higher Education
              </h2>
              <h3 className="text-base font-bold text-indigo-950 uppercase tracking-widest">
                StudentSetu Passport Report
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Generated on: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} &bull; Official Digital Record
              </p>
            </div>

            {/* Student Demographics Block */}
            {incAcademic && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Student Name:</span>
                    <span className="font-bold text-slate-900">{sessionName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Roll Number:</span>
                    <span className="font-bold text-slate-900 font-mono">{student.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Programme:</span>
                    <span className="font-bold text-slate-900">{student.program.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Department:</span>
                    <span className="font-bold text-slate-900">{student.department.name}</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-semibold text-slate-700 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Current Semester / Batch:</span>
                    <span className="font-bold text-slate-900">Sem {student.currentSemester} &bull; {student.batch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Cumulative GPA (CGPA):</span>
                    <span className="font-bold text-slate-900">{student.cgpa.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Last Semester SGPA:</span>
                    <span className="font-bold text-slate-900">{student.sgpa.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[9px]">Attendance Average:</span>
                    <span className="font-bold text-slate-900">{student.attendance.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Student Biography Section */}
            {profileSummary && incAcademic && (
              <div className="space-y-2 pb-2">
                <h4 className="font-bold text-[10px] uppercase text-slate-900 tracking-wider border-b border-slate-200 pb-1.5">
                  Student Profile Biography
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{profileSummary}"
                </p>
              </div>
            )}

            {/* Development Summary Section */}
            {(incVerified || incSelfDeclared || incProjects) && (
              <div className="space-y-3">
                <h4 className="font-bold text-[10px] uppercase text-slate-900 tracking-wider flex items-center border-b border-slate-200 pb-1.5">
                  <Award className="w-4 h-4 mr-1.5 text-indigo-900" /> Development Metrics Overview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-slate-500">Total Filtered</span>
                    <span className="text-lg font-bold text-slate-900 mt-1 block">{filteredTimelineItems.length}</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-emerald-700">Verified</span>
                    <span className="text-lg font-bold text-emerald-800 mt-1 block">{verifiedCount}</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-amber-700">Pending Review</span>
                    <span className="text-lg font-bold text-amber-800 mt-1 block">{pendingCount}</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                    <span className="text-[9px] uppercase font-bold text-blue-700">Self-Declared</span>
                    <span className="text-lg font-bold text-blue-800 mt-1 block">{selfDeclaredCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Summary and profile links ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Profile Links */}
              {incLinks && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[10px] uppercase text-slate-900 tracking-wider flex items-center border-b border-slate-200 pb-1.5">
                    <Globe className="w-4 h-4 mr-1.5 text-indigo-900" /> Professional Profiles URL Links
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {profileLinks.length === 0 ? (
                      <li className="text-slate-450 text-slate-400 italic">No links uploaded.</li>
                    ) : (
                      profileLinks.map((link: any) => (
                        <li key={link.id} className="flex justify-between items-center bg-slate-50/50 p-2 border border-slate-100 rounded-lg">
                          <span className="font-bold uppercase tracking-wider text-[9px] text-slate-500">{link.platformName}</span>
                          <span className="font-mono text-slate-600 truncate max-w-[200px]">{link.profileUrl}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}

              {/* Technical Skills */}
              {incSkills && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[10px] uppercase text-slate-900 tracking-wider flex items-center border-b border-slate-200 pb-1.5">
                    <Code className="w-4 h-4 mr-1.5 text-indigo-900" /> Declared Skills Profile
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {studentSkills.length === 0 ? (
                      <span className="text-slate-400 italic">No skills cataloged.</span>
                    ) : (
                      studentSkills.map((stSk: any) => (
                        <span
                          key={stSk.id}
                          className={`inline-flex px-2 py-0.5 rounded border text-[10px] font-bold ${
                            stSk.status === 'VERIFIED'
                              ? 'bg-emerald-50 border-emerald-150 text-emerald-700'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {stSk.skill.name} &bull; {stSk.level} ({stSk.status.replace('_', ' ')})
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Timeline list */}
            <div className="space-y-4 print:break-before-page">
              <h4 className="font-bold text-[10px] uppercase text-slate-900 tracking-wider flex items-center border-b border-slate-200 pb-1.5">
                <CheckSquare className="w-4 h-4 mr-1.5 text-indigo-900" /> Detailed Development Record Ledger
              </h4>

              <div className="space-y-6 divide-y divide-slate-100">
                {filteredTimelineItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic pt-2">No timeline items selected or match status filter constraints.</p>
                ) : (
                  filteredTimelineItems.map((item, idx) => (
                    <div key={idx} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} text-xs space-y-2 print:break-inside-avoid`}>
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <span className="text-[8px] uppercase font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded mr-2">
                            {item.type}
                          </span>
                          <strong className="text-slate-950 font-bold text-sm">{item.title}</strong>
                        </div>
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                          item.status === 'VERIFIED' ? 'bg-emerald-50 border-emerald-150 text-emerald-700' :
                          item.status === 'SELF_DECLARED' ? 'bg-blue-50 border-blue-150 text-blue-700' : 'bg-slate-55 bg-slate-50 border-slate-200 text-slate-600'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line pr-4">
                        {item.description}
                      </p>

                      {item.outcome && (
                        <p className="text-slate-500 font-semibold italic text-[11px]">
                          Outcome: {item.outcome}
                        </p>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <div>
                          <span>Organiser:</span> <span className="font-semibold text-slate-600">{item.organiser}</span>
                        </div>
                        <div>
                          <span>Role context:</span> <span className="font-semibold text-slate-600">{item.role}</span>
                        </div>
                        <div>
                          <span>Route:</span> <span className="font-semibold text-indigo-900">{item.route.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Institutional Sign-off Footer */}
            <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs print:break-inside-avoid">
              <div className="space-y-1">
                <div className="border-t border-slate-900 w-44 mx-auto pt-2 font-bold text-slate-800">
                  Dean / HOD Signature
                </div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">SIH CSE DEPARTMENT</p>
              </div>
              <div className="space-y-1">
                <div className="border-t border-slate-900 w-44 mx-auto pt-2 font-bold text-slate-800">
                  Registrar Seal
                </div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">OFFICIAL TRANSCRIPT SEAL</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
