// src/app/admin/dashboard/AdminDashboardClient.tsx
'use client';

import { useState } from 'react';
import { 
  Users, 
  Layers, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Search, 
  BookOpen, 
  FileText, 
  ExternalLink,
  GraduationCap,
  TrendingUp,
  X,
  Building,
  Percent,
  ChevronRight
} from 'lucide-react';

interface AdminDashboardClientProps {
  students: any[];
  allActivities: any[];
  allContributions: any[];
}

export default function AdminDashboardClient({ 
  students, 
  allActivities, 
  allContributions 
}: AdminDashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // 1. Overall Institutional Metrics
  const totalStudents = students.length;
  const totalActCount = allActivities.length + allContributions.length;

  const verifiedCount = 
    allActivities.filter(a => a.status === 'VERIFIED').length +
    allContributions.filter(c => c.status === 'VERIFIED').length;

  const pendingCount = 
    allActivities.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length +
    allContributions.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;

  const selfDeclaredCount = 
    allActivities.filter(a => a.status === 'SELF_DECLARED').length +
    allContributions.filter(c => c.status === 'SELF_DECLARED').length;

  // 2. Activities by category count calculation
  const categoryCounts: { [key: string]: number } = {
    Technical: 0,
    'Co-curricular': 0,
    Academic: 0,
    'Self-learning': 0,
    Achievements: 0
  };

  allActivities.forEach(act => {
    if (['Hackathon', 'Project'].includes(act.type)) {
      categoryCounts['Technical']++;
    } else if (['Workshop', 'Seminar', 'Competition', 'Club/SIG Participation'].includes(act.type)) {
      categoryCounts['Co-curricular']++;
    } else if (['Internship', 'Research', 'Publication'].includes(act.type)) {
      categoryCounts['Academic']++;
    } else if (['YouTube Learning', 'Self-study', 'Personal Practice', 'Unhosted Personal Project'].includes(act.type)) {
      categoryCounts['Self-learning']++;
    } else if (['Award', 'Certification'].includes(act.type)) {
      categoryCounts['Achievements']++;
    }
  });
  categoryCounts['Technical'] += allContributions.length; // Project contributions are technical

  // 3. Search logic
  const filteredStudents = students.filter(student => {
    const term = searchQuery.toLowerCase();
    return (
      student.user.name.toLowerCase().includes(term) ||
      student.rollNumber.toLowerCase().includes(term) ||
      student.program.name.toLowerCase().includes(term) ||
      student.department.name.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 uppercase">
            Verified
          </span>
        );
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-150 uppercase">
            Pending
          </span>
        );
      case 'SELF_DECLARED':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-150 uppercase">
            Self-Declared
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Institutional HOD Dashboard</h1>
        <p className="text-slate-500 text-xs mt-1">Campus wide student activities record and verification audit logs.</p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Users className="w-4 h-4 text-indigo-900" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Students</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{totalStudents}</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 text-slate-500 mb-1">
            <Layers className="w-4 h-4 text-indigo-900" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Records</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 block">{totalActCount}</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 text-emerald-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Verified</span>
          </div>
          <span className="text-2xl font-extrabold text-emerald-700 block">{verifiedCount}</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center space-x-2 text-amber-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Pending Review</span>
          </div>
          <span className="text-2xl font-extrabold text-amber-700 block">{pendingCount}</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center space-x-2 text-blue-600 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-wider">Self-Declared</span>
          </div>
          <span className="text-2xl font-extrabold text-blue-700 block">{selfDeclaredCount}</span>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Status Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Verification Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Verified ({verifiedCount})</span>
                <span>{totalActCount > 0 ? Math.round((verifiedCount / totalActCount) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${totalActCount > 0 ? (verifiedCount / totalActCount) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Pending Review ({pendingCount})</span>
                <span>{totalActCount > 0 ? Math.round((pendingCount / totalActCount) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${totalActCount > 0 ? (pendingCount / totalActCount) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Self-Declared ({selfDeclaredCount})</span>
                <span>{totalActCount > 0 ? Math.round((selfDeclaredCount / totalActCount) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${totalActCount > 0 ? (selfDeclaredCount / totalActCount) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Activities by Category */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Activities by Category
          </h3>
          <div className="space-y-3">
            {Object.keys(categoryCounts).map(cat => {
              const count = categoryCounts[cat];
              const percent = totalActCount > 0 ? Math.round((count / totalActCount) * 100) : 0;
              return (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">{cat}</span>
                  <div className="flex items-center space-x-3 w-2/3 justify-end">
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block shrink-0">
                      <div className="bg-indigo-900 h-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="font-bold text-slate-900 w-10 text-right">{count} items</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Student Search & Registry */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header with Search */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Student Registry</h3>
            <p className="text-xs text-slate-500">Search and audit individual Student passports.</p>
          </div>
          
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, roll number..."
              className="pl-9 pr-4 py-2 border border-slate-350 rounded-lg w-full text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 bg-white"
            />
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Department / Program</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4">Activities (V / P / SD)</th>
                <th className="px-6 py-4 text-right">Passport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No students match your search queries.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const act = student.activities;
                  const cont = student.contributions;
                  const v = act.filter((a: any) => a.status === 'VERIFIED').length + cont.filter((c: any) => c.status === 'VERIFIED').length;
                  const p = act.filter((a: any) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length + cont.filter((c: any) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;
                  const sd = act.filter((a: any) => a.status === 'SELF_DECLARED').length;
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {student.user.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {student.program.code} ({student.department.code})
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-800">
                        {student.cgpa.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <span className="font-bold text-emerald-600">{v} verified</span> &bull; <span className="font-bold text-amber-600">{p} pending</span> &bull; <span className="font-bold text-blue-600">{sd} self-declared</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="inline-flex items-center text-xs font-bold text-indigo-900 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>Open Passport</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Read-Only Passport Inspector Overlay Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-end animate-in fade-in-50 duration-200">
          <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-indigo-950 text-white">
              <div>
                <span className="text-[9px] uppercase font-extrabold bg-indigo-900 px-2 py-0.5 rounded text-indigo-200 tracking-wider">
                  Audit Inspector Mode
                </span>
                <h3 className="text-lg font-bold mt-2">{selectedStudent.user.name}'s Development Passport</h3>
                <p className="text-xs text-indigo-300 font-mono mt-0.5">Roll: {selectedStudent.rollNumber} &bull; Sem: {selectedStudent.currentSemester}</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Profile Card Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-indigo-900 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">CGPA / SGPA</span>
                    <span className="font-bold text-sm text-slate-800">{selectedStudent.cgpa.toFixed(2)} / {selectedStudent.sgpa.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                  <Percent className="w-5 h-5 text-indigo-900 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Attendance</span>
                    <span className="font-bold text-sm text-slate-800">{selectedStudent.attendance.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
                  <BookOpen className="w-5 h-5 text-indigo-900 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Profile Completion</span>
                    <span className="font-bold text-sm text-slate-800">{selectedStudent.profileCompletion}%</span>
                  </div>
                </div>
              </div>

              {/* Development summary count metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-emerald-50 border border-emerald-150 p-2.5 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Verified</span>
                  <span className="text-xl font-extrabold text-emerald-950 mt-1 block">
                    {selectedStudent.activities.filter((a: any) => a.status === 'VERIFIED').length + 
                     selectedStudent.contributions.filter((c: any) => c.status === 'VERIFIED').length}
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-150 p-2.5 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Pending</span>
                  <span className="text-xl font-extrabold text-amber-950 mt-1 block">
                    {selectedStudent.activities.filter((a: any) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length + 
                     selectedStudent.contributions.filter((c: any) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length}
                  </span>
                </div>
                <div className="bg-blue-50 border border-blue-150 p-2.5 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-blue-800 block">Self-Declared</span>
                  <span className="text-xl font-extrabold text-blue-950 mt-1 block">
                    {selectedStudent.activities.filter((a: any) => a.status === 'SELF_DECLARED').length}
                  </span>
                </div>
              </div>

              {/* List of Passport Records */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider">Passport Records Archive</h4>
                
                {/* Activities */}
                {[
                  ...selectedStudent.activities.map((a: any) => ({ ...a, displayDate: new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) })),
                  ...selectedStudent.contributions.map((c: any) => ({
                    ...c,
                    title: c.projectName,
                    type: 'Project Contribution',
                    description: `Project: ${c.projectDesc}\nContribution: ${c.contribution}`,
                    displayDate: new Date(c.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                    evidenceUrl: c.projectEvidence,
                    externalLink: c.repoUrl || c.demoUrl
                  }))
                ].map(item => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs shadow-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] uppercase font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">{item.displayDate}</span>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h5>
                      <p className="text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between border-t border-slate-50 pt-2 gap-2 text-[10px] text-slate-400 font-semibold uppercase">
                      <span>Route: <strong className="text-slate-600">{item.verificationRoute.replace('_', ' ')}</strong></span>
                      {item.reviewerName && <span>Reviewed by: <strong className="text-slate-600">{item.reviewerName}</strong></span>}
                    </div>

                    {(item.evidenceUrl || item.externalLink) && (
                      <div className="flex space-x-2 pt-1.5">
                        {item.evidenceUrl && (
                          <a 
                            href={item.evidenceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-[10px] font-bold text-indigo-900 hover:text-indigo-950 border border-indigo-150 px-2 py-1 rounded bg-white shadow-sm"
                          >
                            <FileText className="w-3 h-3 mr-1" /> View Proof
                          </a>
                        )}
                        {item.externalLink && (
                          <a 
                            href={item.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-[10px] font-bold text-slate-600 hover:text-slate-950 border border-slate-200 px-2 py-1 rounded bg-white shadow-sm"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" /> Visit URL
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 shadow-sm transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
