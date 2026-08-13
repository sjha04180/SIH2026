// src/app/admin/registry/RegistryClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  GraduationCap
} from 'lucide-react';

interface Department {
  id: string;
  name: string;
  code: string;
}

interface Program {
  id: string;
  name: string;
  code: string;
  departmentId: string;
}

interface RegistryClientProps {
  departments: Department[];
  programs: Program[];
}

export default function RegistryClient({ departments, programs }: RegistryClientProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [programId, setProgramId] = useState('');
  const [currentSemester, setCurrentSemester] = useState('1');
  const [batch, setBatch] = useState('2024-2028');
  const [cgpa, setCgpa] = useState('8.00');
  const [sgpa, setSgpa] = useState('8.00');
  const [attendance, setAttendance] = useState('85.0');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  // Filter programs based on selected department
  const filteredPrograms = programs.filter(p => p.departmentId === departmentId);

  // Set default program whenever department changes
  const handleDeptChange = (deptId: string) => {
    setDepartmentId(deptId);
    const related = programs.find(p => p.departmentId === deptId);
    setProgramId(related?.id || '');
  };

  // Trigger default program selection on mount
  if (!programId && filteredPrograms.length > 0) {
    setProgramId(filteredPrograms[0].id);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          rollNumber,
          departmentId,
          programId,
          currentSemester: parseInt(currentSemester),
          batch,
          cgpa: parseFloat(cgpa),
          sgpa: parseFloat(sgpa),
          attendance: parseFloat(attendance),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to register student');

      setSuccess(true);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRollNumber('');
      setBatch('2024-2028');
      setCurrentSemester('1');
      setCgpa('8.00');
      setSgpa('8.00');
      setAttendance('85.0');
      
      router.refresh();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Student Registry & Setup</h1>
        <p className="text-slate-500 text-xs mt-1">HOD registry setup. Upload student credential records and assign baseline academic data.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center space-x-3">
          <div className="p-2 bg-indigo-900 text-white rounded-lg">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Administrative Enrollment Form</h3>
            <p className="text-xs text-slate-500 mt-0.5">Populate students and lock authoritative academic snapshots.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-xs text-emerald-700">
              ✓ Student record enrolled and academic transcript initialized successfully.
            </div>
          )}

          {/* Student Profile Identity Section */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase text-indigo-900 tracking-wider flex items-center border-b border-slate-100 pb-2">
              Student Profile Credentials
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanshu Jha"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">University ID / Roll Number</label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 2026CSE108"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Initial Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. student123"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Academic Allocation Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs uppercase text-indigo-900 tracking-wider flex items-center border-b border-slate-100 pb-2">
              Academic Program & Semester Setup
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-950 focus:outline-none bg-white"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Program Code</label>
                <select
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-950 focus:outline-none bg-white"
                >
                  {filteredPrograms.map(p => (
                    <option key={p.id} value={p.id}>{p.code}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Semester</label>
                <select
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-950 focus:outline-none bg-white font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Academic Batch</label>
                <input
                  type="text"
                  required
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="e.g. 2024-2028"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Authoritative Grades import data */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs uppercase text-indigo-900 tracking-wider flex items-center border-b border-slate-100 pb-2">
              Transcripts & Attendance Snapshot
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cumulative GPA (CGPA)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.0"
                  max="10.0"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="9.00"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Latest Semester SGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.0"
                  max="10.0"
                  required
                  value={sgpa}
                  onChange={(e) => setSgpa(e.target.value)}
                  placeholder="9.00"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Attendance Percentage</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.0"
                  max="100.0"
                  required
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  placeholder="85.0"
                  className="border border-slate-350 rounded-lg w-full px-3 py-2 text-xs text-slate-900 focus:outline-none bg-white font-bold"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-indigo-950">
              <Info className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
              <span>
                **Registrar Note:** Registering a student creates their institutional `User` account, links their `Student` profile, and creates their baseline `AcademicRecord` transcript node.
              </span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Enrolling...
                </>
              ) : (
                'Enrol Student Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
