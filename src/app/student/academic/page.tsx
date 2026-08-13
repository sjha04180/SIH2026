// src/app/student/academic/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { GraduationCap, Award, Percent, BookOpen, Clock, AlertCircle } from 'lucide-react';

export default async function AcademicSnapshotPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    redirect('/');
  }

  const student = await prisma.student.findUnique({
    where: { id: session.profileId },
    include: {
      program: true,
      department: true,
      academicRecords: {
        orderBy: { semester: 'asc' },
      },
    },
  });

  if (!student) {
    redirect('/');
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Academic Snapshot</h1>
        <p className="text-slate-500 text-xs mt-1">Official institutional academic transcript and attendance tracking.</p>
      </div>

      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex items-start space-x-3 text-xs leading-relaxed">
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <strong className="block font-bold">Authoritative Data Warning</strong>
          Academic transcripts, grades, semester SGPA/CGPA, and attendance figures are imported directly from the registrar's official database. Students are not authorized to edit this information. For adjustments, please contact the administrative office.
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-900 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Cumulative GPA (CGPA)</span>
            <span className="text-2xl font-extrabold text-slate-950 mt-1 block">{student.cgpa.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block">First Class Distinction</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-900 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Latest SGPA (Sem {student.currentSemester - 1})</span>
            <span className="text-2xl font-extrabold text-slate-950 mt-1 block">{student.sgpa.toFixed(2)}</span>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded mt-1.5 inline-block">Term Average</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center space-x-4">
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-900 shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Overall Attendance</span>
            <span className="text-2xl font-extrabold text-slate-950 mt-1 block">{student.attendance.toFixed(1)}%</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1.5 inline-block ${student.attendance >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {student.attendance >= 80 ? 'Eligible' : 'Attendance Shortage'}
            </span>
          </div>
        </div>
      </div>

      {/* Semester History Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Semester-wise Progress Log</h3>
          <p className="text-xs text-slate-500 mt-1">Audit log of your official grades and attendance history.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Semester</th>
                <th className="px-6 py-4">SGPA</th>
                <th className="px-6 py-4">CGPA</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Imported At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 font-medium text-slate-900">
              {student.academicRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-semibold">
                    No academic term records imported yet.
                  </td>
                </tr>
              ) : (
                student.academicRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-55/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      Semester {record.semester}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-800">
                      {record.sgpa.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-800">
                      {record.cgpa.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${record.attendance >= 80 ? 'text-slate-800' : 'text-amber-600'}`}>
                        {record.attendance.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase border border-emerald-150">
                        {record.examStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {new Date(record.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
