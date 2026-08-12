// src/app/student/reports/ReportClient.tsx
'use client';

import { Printer, Award, CheckSquare, Info } from 'lucide-react';
import Link from 'next/link';

interface ReportClientProps {
  student: any;
  sessionName: string;
}

export default function ReportClient({ student, sessionName }: ReportClientProps) {
  const { activities, contributions } = student;

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans p-4">
      
      {/* Print Instructions Box - Hides during printing */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 print:hidden">
        <Info className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 leading-relaxed">
          <strong className="block mb-0.5">Print-Ready Digital Document</strong>
          Click the **Print / Export Report** button below to open the browser's native PDF printer window. The styles are optimized to hide the sidebar, header, and buttons, ensuring a clean, official academic report layout.
          <div className="mt-3 flex items-center space-x-3">
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              className="inline-flex items-center px-3.5 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg font-bold text-xs shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              <span>Print / Export Report</span>
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
      <div className="bg-white border border-slate-350 p-8 sm:p-12 shadow-sm rounded-2xl print:border-none print:shadow-none print:p-0 print:m-0 space-y-8">
        
        {/* Certificate Style Header */}
        <div className="text-center space-y-3 pb-6 border-b-2 border-slate-900">
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-wide uppercase">
            SIH Institute of Higher Education
          </h2>
          <h3 className="text-base font-bold text-indigo-950 uppercase tracking-widest">
            Student Development Passport Report
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Generated on: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} &bull; Official Digital Record
          </p>
        </div>

        {/* Student Demographics Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Student Name:</span>
              <span className="font-bold text-slate-800">{sessionName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Roll Number:</span>
              <span className="font-bold text-slate-800 font-mono">{student.rollNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Programme:</span>
              <span className="font-bold text-slate-800">{student.program.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Department:</span>
              <span className="font-bold text-slate-800">{student.department.name}</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Current Semester / Batch:</span>
              <span className="font-bold text-slate-800">Sem {student.currentSemester} &bull; {student.batch}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Cumulative GPA (CGPA):</span>
              <span className="font-bold text-slate-800">{student.cgpa.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Last Semester SGPA:</span>
              <span className="font-bold text-slate-800">{student.sgpa.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Attendance Average:</span>
              <span className="font-bold text-slate-800">{student.attendance.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Development Summary Section */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider flex items-center border-b border-slate-200 pb-2">
            <Award className="w-4 h-4 mr-1.5 text-indigo-900" /> Development Metrics Overview
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-slate-500">Total Activities</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">{totalActivities}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-150 p-3 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-emerald-700">Verified</span>
              <span className="text-lg font-bold text-emerald-800 mt-1 block">{verifiedCount}</span>
            </div>
            <div className="bg-amber-50 border border-amber-150 p-3 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-amber-700">Pending Review</span>
              <span className="text-lg font-bold text-amber-800 mt-1 block">{pendingCount}</span>
            </div>
            <div className="bg-blue-50 border border-blue-150 p-3 rounded-lg">
              <span className="text-[10px] uppercase font-semibold text-blue-700">Self-Declared</span>
              <span className="text-lg font-bold text-blue-800 mt-1 block">{selfDeclaredCount}</span>
            </div>
          </div>
        </div>

        {/* Detailed Timeline list */}
        <div className="space-y-4">
          <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider flex items-center border-b border-slate-200 pb-2">
            <CheckSquare className="w-4 h-4 mr-1.5 text-indigo-900" /> Detailed Development Record Ledger
          </h4>

          <div className="space-y-4 divide-y divide-slate-100">
            {allTimelineItems.map((item, idx) => (
              <div key={idx} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} text-xs space-y-2`}>
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded mr-2">
                      {item.type}
                    </span>
                    <strong className="text-slate-950 font-bold text-sm">{item.title}</strong>
                  </div>
                  <span className="inline-flex px-2 py-0.5 rounded bg-slate-50 border border-slate-150 text-[10px] font-bold text-slate-700 uppercase">
                    {item.status}
                  </span>
                </div>
                
                <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line pr-4">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1.5 text-[11px] text-slate-500 font-medium">
                  <div>
                    <span>Source/Organiser:</span> <span className="font-semibold text-slate-700">{item.organiser}</span>
                  </div>
                  <div>
                    <span>My Role:</span> <span className="font-semibold text-slate-700">{item.role}</span>
                  </div>
                  <div>
                    <span>Verification Route:</span> <span className="font-semibold text-indigo-900">{item.route.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Sign-off Footer */}
        <div className="pt-12 grid grid-cols-2 gap-12 text-center text-xs">
          <div className="space-y-1">
            <div className="border-t border-slate-900 w-44 mx-auto pt-2 font-bold text-slate-800">
              Dean / HOD Signature
            </div>
            <p className="text-[10px] text-slate-400">Institutional Authority Sign-off</p>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-900 w-44 mx-auto pt-2 font-bold text-slate-800">
              Registrar Seal
            </div>
            <p className="text-[10px] text-slate-400">Official Digital Stamp</p>
          </div>
        </div>

      </div>
    </div>
  );
}
