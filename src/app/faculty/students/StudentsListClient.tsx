// src/app/faculty/students/StudentsListClient.tsx
'use client';

import { useState } from 'react';
import { 
  Users, 
  Search, 
  ChevronRight, 
  GraduationCap, 
  Percent, 
  BookOpen, 
  FileText, 
  ExternalLink,
  Globe,
  Code,
  X
} from 'lucide-react';

interface Student {
  id: string;
  rollNumber: string;
  currentSemester: number;
  batch: string;
  cgpa: number;
  sgpa: number;
  attendance: number;
  profileCompletion: number;
  profileSummary: string | null;
  interests: string | null;
  user: {
    name: string;
    email: string;
  };
  program: {
    name: string;
    code: string;
  };
  department: {
    name: string;
    code: string;
  };
  profileLinks: any[];
  studentSkills: any[];
  activities: any[];
  contributions: any[];
}

interface StudentsListClientProps {
  students: Student[];
  department: string;
}

export default function StudentsListClient({ students, department }: StudentsListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student => {
    const term = searchQuery.toLowerCase();
    return (
      student.user.name.toLowerCase().includes(term) ||
      student.rollNumber.toLowerCase().includes(term)
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
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">My Cohort Students</h1>
        <p className="text-slate-500 text-xs mt-1">Cohort group: Department of {department}. Perform academic counseling and view passports.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Registry search header */}
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Cohort Registry</h3>
            <p className="text-xs text-slate-500">View locked academic transcripts and verified timelines.</p>
          </div>
          
          <div className="relative max-w-sm w-full font-semibold">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cohort by name or roll..."
              className="pl-9 pr-4 py-2 border border-slate-355 rounded-lg w-full text-xs text-slate-900 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Table of students */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Roll Number</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Program / Sem</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4 text-right">Passport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No students found in your department cohort.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-700">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {student.user.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">
                      {student.program.code} &bull; Sem {student.currentSemester}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-800">
                      {student.cgpa.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${student.attendance >= 80 ? 'text-slate-850' : 'text-amber-600'}`}>
                        {student.attendance.toFixed(1)}%
                      </span>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Read-Only Passport Inspector Overlay Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-end animate-in fade-in-50 duration-200">
          <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-indigo-950 text-white">
              <div>
                <span className="text-[9px] uppercase font-extrabold bg-indigo-900 px-2 py-0.5 rounded text-indigo-200 tracking-wider">
                  Academic Passport Reviewer
                </span>
                <h3 className="text-lg font-bold mt-2">{selectedStudent.user.name}'s Passport</h3>
                <p className="text-xs text-indigo-300 font-mono mt-0.5">Roll: {selectedStudent.rollNumber} &bull; Sem: {selectedStudent.currentSemester}</p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
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

              {/* Bio summary */}
              {selectedStudent.profileSummary && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-655 leading-relaxed">
                  <strong className="text-slate-900 block mb-1">Student Biography</strong>
                  "{selectedStudent.profileSummary}"
                </div>
              )}

              {/* Profile Links & Skills Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-100 pt-4 text-xs font-semibold">
                {/* Links */}
                <div className="space-y-2">
                  <span className="block font-bold text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-indigo-900" /> Professional links
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.profileLinks.length === 0 ? (
                      <span className="text-slate-400 italic text-[11px]">No links uploaded.</span>
                    ) : (
                      selectedStudent.profileLinks.map(link => (
                        <a
                          key={link.id}
                          href={link.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-0.5 rounded text-slate-700"
                        >
                          <span className="font-bold text-[9px] uppercase">{link.platformName}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <span className="block font-bold text-[9px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Code className="w-3.5 h-3.5 text-indigo-900" /> Declared Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.studentSkills.length === 0 ? (
                      <span className="text-slate-400 italic text-[11px]">No skills declared.</span>
                    ) : (
                      selectedStudent.studentSkills.map(stSk => (
                        <span
                          key={stSk.id}
                          className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold ${
                            stSk.status === 'VERIFIED'
                              ? 'bg-emerald-50 border-emerald-150 text-emerald-700'
                              : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {stSk.skill.name} &bull; {stSk.level}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Passport Records Timeline */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase text-slate-700 tracking-wider">Passport Records Archive</h4>
                
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
                      <p className="text-slate-655 mt-1 whitespace-pre-line leading-relaxed">{item.description}</p>
                    </div>

                    {item.type === 'Project Contribution' && item.technologies && (
                      <div className="flex flex-wrap gap-1">
                        {item.technologies.split(',').map((tech: string) => (
                          <span key={tech} className="bg-indigo-50 border border-indigo-150 text-indigo-900 px-2 py-0.5 rounded text-[9px] font-bold">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between border-t border-slate-50 pt-2 gap-2 text-[10px] text-slate-400 font-semibold uppercase">
                      <span>Route: <strong className="text-slate-600">{item.verificationRoute.replace('_', ' ')}</strong></span>
                      {item.reviewerName && <span>Reviewed by: <strong className="text-slate-600">{item.reviewerName}</strong></span>}
                    </div>

                    {(item.evidenceUrl || item.externalLink) && (
                      <div className="flex space-x-2 pt-1">
                        {item.evidenceUrl && (
                          <a 
                            href={item.evidenceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-[10px] font-bold text-indigo-900 hover:text-indigo-950 border border-indigo-155 px-2 py-1 rounded bg-white shadow-sm"
                          >
                            <FileText className="w-3 h-3 mr-1" /> View Proof
                          </a>
                        )}
                        {item.externalLink && (
                          <a 
                            href={item.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center text-[10px] font-bold text-slate-655 hover:text-slate-950 border border-slate-200 px-2 py-1 rounded bg-white shadow-sm"
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

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 shadow-sm transition-colors cursor-pointer"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
