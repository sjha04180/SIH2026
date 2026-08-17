// src/app/student/dashboard/page.tsx
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  FilePlus2, 
  FolderPlus, 
  ExternalLink, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  Percent,
  Printer
} from 'lucide-react';

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'STUDENT') {
    redirect('/');
  }

  // Fetch Student data
  const student = await prisma.student.findUnique({
    where: { id: session.profileId },
    include: {
      program: true,
      department: true,
      activities: {
        orderBy: { date: 'desc' }
      },
      contributions: {
        orderBy: { startDate: 'desc' }
      }
    }
  });

  if (!student) {
    redirect('/');
  }

  const { activities, contributions } = student;

  // Counts
  const totalActivities = activities.length + contributions.length;
  
  const verifiedCount = 
    activities.filter(a => a.status === 'VERIFIED').length + 
    contributions.filter(c => c.status === 'VERIFIED').length;
    
  const pendingCount = 
    activities.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length + 
    contributions.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW').length;
    
  const selfDeclaredCount = 
    activities.filter(a => a.status === 'SELF_DECLARED').length +
    contributions.filter(c => c.status === 'SELF_DECLARED').length;

  const returnedCount = 
    activities.filter(a => a.status === 'RETURNED').length +
    contributions.filter(c => c.status === 'RETURNED').length;

  // Combine activities and contributions for a unified recent timeline (max 5 items)
  const timelineItems = [
    ...activities.map(a => ({
      id: a.id,
      title: a.title,
      type: a.type,
      date: a.date,
      status: a.status,
      route: a.verificationRoute,
      category: 'Activity'
    })),
    ...contributions.map(c => ({
      id: c.id,
      title: c.projectName,
      type: 'Project Contribution',
      date: c.startDate,
      status: c.status,
      route: c.verificationRoute,
      category: 'Project'
    }))
  ]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
          </span>
        );
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      case 'RETURNED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <AlertTriangle className="w-3 h-3 mr-1" /> Returned
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      case 'SELF_DECLARED':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <HelpCircle className="w-3 h-3 mr-1" /> Self-Declared
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Info Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full">
            Active Student Profile
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-3">Welcome, {session.name}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {student.program.name} &bull; CSE Department &bull; Semester {student.currentSemester}
          </p>
        </div>
        {/* Profile Completion Indicator */}
        <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-slate-800 text-sm">
              {student.profileCompletion}%
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Passport Completion</h4>
            <p className="text-xs text-slate-500 mt-0.5">Keep adding activities to complete your record.</p>
          </div>
        </div>
      </div>

      {/* Onboarding Recovery Access Banner */}
      {!student.personalEmail && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="bg-indigo-950 text-white p-2.5 rounded-xl shadow-sm shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-950 text-sm">Setup Recovery & Permanent Access</h4>
              <p className="text-xs text-indigo-900/70 mt-1 leading-relaxed">
                Add your personal email to ensure you retain lifelong access to your verified StudentSetu Passport after graduation.
              </p>
            </div>
          </div>
          <Link
            href="/student/profile"
            className="inline-flex items-center px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm shrink-0 transition-all"
          >
            Configure Recovery
          </Link>
        </div>
      )}

      {/* Dynamic Status / Guidance Alerts */}
      {returnedCount > 0 ? (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Action Required</h4>
              <p className="text-xs text-slate-500 mt-1">
                {returnedCount} of your recorded items have been returned by reviewers for corrections.
              </p>
            </div>
          </div>
          <Link
            href="/student/passport?tab=view&status=RETURNED"
            className="inline-flex items-center px-3.5 py-1.5 border border-orange-200 text-orange-700 hover:bg-orange-100/50 text-xs font-semibold rounded-lg shrink-0 transition-colors"
          >
            Fix Returned Records
          </Link>
        </div>
      ) : pendingCount > 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Awaiting Review</h4>
              <p className="text-xs text-slate-500 mt-1">
                You have {pendingCount} development records currently awaiting official review.
              </p>
            </div>
          </div>
          <Link
            href="/student/passport?tab=view"
            className="text-xs font-bold text-amber-800 hover:underline shrink-0 flex items-center"
          >
            <span>View Pending Progress</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>
      ) : totalActivities === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm space-y-4">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Your Passport is empty</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Start building your official StudentSetu profile by adding your first certified activity or project build.
            </p>
          </div>
          <Link
            href="/student/passport?tab=add-activity"
            className="inline-flex items-center px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm"
          >
            Record Your First Activity
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-sm flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-emerald-800">Your StudentSetu Passport is fully up to date!</span>
        </div>
      )}

      {/* Prominent How Can We Help Entry Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900">How can we help you today?</h3>
          <p className="text-xs text-slate-500 mt-1">
            Choose a guided flow below to submit certified achievements or generate printable academic files.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Action 1 */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl flex flex-col justify-between h-48 group hover:border-indigo-900/30 transition-all hover:bg-slate-50/80">
            <div>
              <div className="bg-indigo-900 text-white p-2 rounded-lg shadow-sm w-9 h-9 flex items-center justify-center">
                <FilePlus2 className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm mt-4">Add an Activity</h4>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Record hackathons, online certifications, workshops, internships, or self-learning.
              </p>
            </div>
            <Link
              href="/student/passport?tab=add-activity"
              className="inline-flex items-center text-xs font-bold text-indigo-900 mt-4 group-hover:text-indigo-950"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Action 2 */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl flex flex-col justify-between h-48 group hover:border-indigo-900/30 transition-all hover:bg-slate-50/80">
            <div>
              <div className="bg-slate-200 text-slate-700 p-2 rounded-lg w-9 h-9 flex items-center justify-center">
                <FolderPlus className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm mt-4">Add a Project</h4>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Describe a personal or team software build, including your specific technical role.
              </p>
            </div>
            <Link
              href="/student/passport?tab=add-project"
              className="inline-flex items-center text-xs font-bold text-slate-700 mt-4 group-hover:text-indigo-900"
            >
              <span>Record Project</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Action 3 */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl flex flex-col justify-between h-48 group hover:border-indigo-900/30 transition-all hover:bg-slate-50/80">
            <div>
              <div className="bg-slate-200 text-slate-700 p-2 rounded-lg w-9 h-9 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm mt-4">View My Passport</h4>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Examine your entire developmental ledger, verification history, and feedback.
              </p>
            </div>
            <Link
              href="/student/passport"
              className="inline-flex items-center text-xs font-bold text-slate-700 mt-4 group-hover:text-indigo-900"
            >
              <span>Examine Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Action 4 */}
          <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl flex flex-col justify-between h-48 group hover:border-indigo-900/30 transition-all hover:bg-slate-50/80">
            <div>
              <div className="bg-slate-200 text-slate-700 p-2 rounded-lg w-9 h-9 flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm mt-4">Generate My Report</h4>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                Select and compile records into an official PDF report for printing or sharing.
              </p>
            </div>
            <Link
              href="/student/reports"
              className="inline-flex items-center text-xs font-bold text-slate-700 mt-4 group-hover:text-indigo-900"
            >
              <span>Run PDF Builder</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Academic & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Metrics and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
              <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">Total Records</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-2 block">{totalActivities}</span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
              <span className="text-xs text-emerald-600 font-semibold block uppercase tracking-wider">Verified</span>
              <span className="text-3xl font-extrabold text-emerald-700 mt-2 block">{verifiedCount}</span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
              <span className="text-xs text-amber-600 font-semibold block uppercase tracking-wider">Pending</span>
              <span className="text-3xl font-extrabold text-amber-700 mt-2 block">{pendingCount}</span>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
              <span className="text-xs text-blue-600 font-semibold block uppercase tracking-wider">Self-Declared</span>
              <span className="text-3xl font-extrabold text-blue-700 mt-2 block">{selfDeclaredCount}</span>
            </div>
          </div>

          {/* Recent Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Recent Activities Timeline</h3>
              <Link href="/student/passport" className="text-indigo-900 text-xs font-bold hover:underline flex items-center">
                View All Passport Records <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            
            {timelineItems.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm">No activity recorded yet.</p>
                <Link href="/student/passport#add-activity" className="text-indigo-900 text-xs font-bold hover:underline mt-2 inline-block">
                  Record your first activity now
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {timelineItems.map((item, idx) => (
                  <div key={item.id} className="flex items-start relative group">
                    {idx !== timelineItems.length - 1 && (
                      <span className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-slate-100 group-last:hidden" />
                    )}
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-indigo-900/10 flex items-center justify-center text-[10px] text-indigo-900 font-bold shrink-0 mt-1 mr-4">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                        <h4 className="font-bold text-slate-950 text-sm truncate">{item.title}</h4>
                        <div className="shrink-0">{getStatusBadge(item.status)}</div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.type} &bull; {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      
                      {/* Classification Route indicator */}
                      <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Route: <span className="text-slate-600">{item.route.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Academic Snapshot */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-indigo-900" /> Academic Snapshot
            </h3>

            {/* GPA indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-indigo-950 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">CGPA</span>
                  <span className="text-lg font-extrabold text-indigo-950">{student.cgpa.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-indigo-950 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">SGPA (Last)</span>
                  <span className="text-lg font-extrabold text-indigo-950">{student.sgpa.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Attendance card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Percent className="w-5 h-5 text-indigo-950 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Attendance</span>
                  <span className="text-sm font-bold text-indigo-950">Overall Average</span>
                </div>
              </div>
              <span className={`text-lg font-extrabold ${student.attendance >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {student.attendance.toFixed(1)}%
              </span>
            </div>

            {/* General Institutional Context */}
            <div className="text-xs text-slate-500 space-y-2.5 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
              <div className="flex justify-between">
                <span>Institution:</span>
                <span className="font-semibold text-slate-700">SIH University</span>
              </div>
              <div className="flex justify-between">
                <span>Department:</span>
                <span className="font-semibold text-slate-700">{student.department.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Programme:</span>
                <span className="font-semibold text-slate-700">{student.program.code}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span className="font-semibold text-emerald-600">Active / Enrolled</span>
              </div>
            </div>

            <div className="bg-indigo-50/60 p-4 rounded-xl text-[11px] text-indigo-950 leading-relaxed">
              <strong>Institutional Note:</strong> This academic data is imported directly from the registrar system. For exams or registration requests, contact the administrative office.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
