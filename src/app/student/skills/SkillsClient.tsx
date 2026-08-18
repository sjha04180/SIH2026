// src/app/student/skills/SkillsClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Code, 
  Trash2, 
  CheckCircle2, 
  Plus, 
  HelpCircle,
  Loader2,
  ShieldCheck,
  Award
} from 'lucide-react';

interface StudentSkill {
  id: string;
  skillId: string;
  level: string;
  status: string;
  verifiedBy: string | null;
  skill: {
    name: string;
    category: string;
  };
}

interface CatalogSkill {
  id: string;
  name: string;
  category: string;
}

interface SkillsClientProps {
  initialStudentSkills: StudentSkill[];
  catalogSkills: CatalogSkill[];
}

export default function SkillsClient({ initialStudentSkills, catalogSkills }: SkillsClientProps) {
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillCategory, setCustomSkillCategory] = useState('Backend');
  const [level, setLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Exclude already added skills from catalog select
  const addedSkillIds = new Set(initialStudentSkills.map(s => s.skillId));
  const availableSkills = catalogSkills.filter(s => !addedSkillIds.has(s.id));

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId && !customSkillName.trim()) {
      setError('Please select a skill from the catalog or write your own.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/student/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillId: selectedSkillId || undefined,
          customSkillName: customSkillName.trim() || undefined,
          customSkillCategory: customSkillName.trim() ? customSkillCategory : undefined,
          level,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to add skill');

      setSelectedSkillId('');
      setCustomSkillName('');
      setLevel('Beginner');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to remove this skill declaration?')) return;

    try {
      const response = await fetch('/api/student/skills', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete skill');

      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to remove skill.');
    }
  };

  const getLevelBadgeStyle = (lvl: string) => {
    switch (lvl) {
      case 'Expert':
        return 'bg-purple-50 text-purple-700 border-purple-250';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-250';
      case 'Beginner':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-250';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">My Skills Index</h1>
        <p className="text-slate-500 text-xs mt-1">Declare technology profiles. Verify technical capability via official records.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Add Skill */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden lg:col-span-1">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center">
              <Plus className="w-4 h-4 mr-1.5 text-indigo-900" /> Declare Technical Skill
            </h3>
            <p className="text-xs text-slate-500 mt-1">Self-declare technologies. These will remain unverified until officially validated.</p>
          </div>

          <form onSubmit={handleAddSkill} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded text-xs text-red-700">
                {error}
              </div>
            )}

            {/* Select Skill */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Skill</label>
              <select
                value={selectedSkillId}
                onChange={(e) => {
                  setSelectedSkillId(e.target.value);
                  if (e.target.value) {
                    setCustomSkillName('');
                  }
                }}
                className="bg-slate-50 border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900"
              >
                <option value="">-- Choose technology --</option>
                {availableSkills.map(sk => (
                  <option key={sk.id} value={sk.id}>{sk.name} ({sk.category})</option>
                ))}
              </select>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Custom Skill */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Write Custom Skill</label>
              <input
                type="text"
                placeholder="e.g. Docker, AWS, Kubernetes"
                value={customSkillName}
                onChange={(e) => {
                  setCustomSkillName(e.target.value);
                  if (e.target.value) {
                    setSelectedSkillId('');
                  }
                }}
                className="bg-slate-50 border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900 placeholder:text-slate-400"
              />
            </div>

            {customSkillName.trim() !== '' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Skill Category</label>
                <select
                  value={customSkillCategory}
                  onChange={(e) => setCustomSkillCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900"
                >
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Database">Database</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Devops">Devops</option>
                  <option value="SoftSkills">Soft Skills</option>
                </select>
              </div>
            )}

            {/* Select Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Declared Competence</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="bg-slate-50 border border-slate-350 rounded-lg w-full px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-900"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || (!selectedSkillId && !customSkillName.trim())}
              className="w-full py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center justify-center disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Declaring...
                </>
              ) : (
                'Add to Skills Passport'
              )}
            </button>

            {availableSkills.length === 0 && !customSkillName.trim() && (
              <p className="text-[10px] text-slate-400 italic text-center">All catalog skills already declared. You can still write a custom skill above.</p>
            )}
          </form>
        </div>

        {/* Right Columns: Skills Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-2.5">
            Declared Skills Ledger
          </h3>

          {initialStudentSkills.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-xl">
              <Code className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs">No technical skills declared yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {initialStudentSkills.map(stSk => (
                <div 
                  key={stSk.id} 
                  className={`border rounded-xl p-4 flex items-center justify-between shadow-sm bg-slate-50/20 hover:bg-slate-50/50 transition-all ${
                    stSk.status === 'VERIFIED' ? 'border-emerald-150' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-slate-900 text-sm truncate">{stSk.skill.name}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getLevelBadgeStyle(stSk.level)}`}>
                        {stSk.level}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">{stSk.skill.category}</span>
                    
                    {/* Status Badge */}
                    <div className="flex items-center space-x-1.5">
                      {stSk.status === 'VERIFIED' ? (
                        <span className="inline-flex items-center text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150 uppercase tracking-wide">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-150 uppercase tracking-wide">
                          <HelpCircle className="w-3 h-3 mr-1" /> Self-Declared
                        </span>
                      )}
                      {stSk.verifiedBy && (
                        <span className="text-[9px] text-slate-400 truncate">by {stSk.verifiedBy}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSkill(stSk.id)}
                    className="p-2 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg hover:border-red-150 transition-colors shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
