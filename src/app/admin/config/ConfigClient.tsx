// src/app/admin/config/ConfigClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings2, 
  Loader2, 
  CheckCircle2, 
  Info,
  Edit2,
  X,
  Save,
  ShieldAlert
} from 'lucide-react';

interface ActivityCategory {
  id: string;
  name: string;
  requiresEvidence: boolean;
  evidenceClass: string;
  verificationType: string;
  verificationRequired: boolean;
  allowedSelfDeclaration: boolean;
  verificationAuthority: string;
}

interface ConfigClientProps {
  initialRules: ActivityCategory[];
}

export default function ConfigClient({ initialRules }: ConfigClientProps) {
  const [selectedRule, setSelectedRule] = useState<ActivityCategory | null>(null);
  
  // Rule form states
  const [requiresEvidence, setRequiresEvidence] = useState(true);
  const [verificationRequired, setVerificationRequired] = useState(true);
  const [verificationType, setVerificationType] = useState('FACULTY_TG');
  const [verificationAuthority, setVerificationAuthority] = useState('FACULTY');
  const [allowedSelfDeclaration, setAllowedSelfDeclaration] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleEditClick = (rule: ActivityCategory) => {
    setSelectedRule(rule);
    setRequiresEvidence(rule.requiresEvidence);
    setVerificationRequired(rule.verificationRequired);
    setVerificationType(rule.verificationType);
    setVerificationAuthority(rule.verificationAuthority);
    setAllowedSelfDeclaration(rule.allowedSelfDeclaration);
    setError('');
    setSuccess(false);
  };

  const handleUpdateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRule.id,
          requiresEvidence,
          verificationType,
          verificationRequired,
          allowedSelfDeclaration,
          verificationAuthority,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update rule');

      setSuccess(true);
      setSelectedRule(null);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Verification Rules Configurator</h1>
        <p className="text-slate-500 text-xs mt-1">Configure evidence requirements, routing, and verification authorities for categories.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded text-xs text-emerald-700">
          ✓ Verification configuration updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Table of categories */}
        <div className={`bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden ${selectedRule ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-indigo-900" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Classification Catalog</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Category Name</th>
                  <th className="px-6 py-3.5">Evidence Reqd</th>
                  <th className="px-6 py-3.5">Verification</th>
                  <th className="px-6 py-3.5">Review Route</th>
                  <th className="px-6 py-3.5">Authority</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                {initialRules.map(rule => (
                  <tr key={rule.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{rule.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                        rule.requiresEvidence 
                          ? 'bg-amber-50 text-amber-700 border-amber-150' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {rule.requiresEvidence ? 'Mandatory' : 'Optional'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                        rule.verificationRequired 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-150' 
                          : 'bg-blue-50 text-blue-700 border-blue-150'
                      }`}>
                        {rule.verificationRequired ? 'Required' : 'Self-Declared'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-655 text-[10px]">{rule.verificationType}</td>
                    <td className="px-6 py-4 uppercase font-bold text-slate-500 text-[10px]">{rule.verificationAuthority}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleEditClick(rule)}
                        className="inline-flex items-center text-xs font-bold text-indigo-900 hover:text-indigo-950 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rule Editor Panel (Col span 1) */}
        {selectedRule && (
          <div className="bg-white border border-indigo-900/10 rounded-2xl shadow-md p-6 space-y-6 lg:col-span-1 relative animate-in fade-in-50 duration-200">
            {/* Close */}
            <button 
              onClick={() => setSelectedRule(null)} 
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded">
                Rule Editor
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-2">Modify "{selectedRule.name}"</h3>
              <p className="text-slate-450 text-xs mt-0.5">Customize verification routes and constraint logic.</p>
            </div>

            <form onSubmit={handleUpdateRule} className="space-y-4 text-xs font-semibold text-slate-700">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded text-[11px] text-red-700">
                  {error}
                </div>
              )}

              {/* Requires Evidence */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Requires Evidence Attachment</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                    <input 
                      type="radio" 
                      checked={requiresEvidence} 
                      onChange={() => setRequiresEvidence(true)} 
                      className="text-indigo-900"
                    />
                    <span>Yes (Mandatory)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                    <input 
                      type="radio" 
                      checked={!requiresEvidence} 
                      onChange={() => setRequiresEvidence(false)} 
                      className="text-indigo-900"
                    />
                    <span>No (Optional)</span>
                  </label>
                </div>
              </div>

              {/* Verification Required */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Verification Requirement</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                    <input 
                      type="radio" 
                      checked={verificationRequired} 
                      onChange={() => setVerificationRequired(true)} 
                    />
                    <span>Queue for Review</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-800">
                    <input 
                      type="radio" 
                      checked={!verificationRequired} 
                      onChange={() => {
                        setVerificationRequired(false);
                        setVerificationType('SELF_DECLARED');
                        setVerificationAuthority('NONE');
                      }} 
                    />
                    <span>Direct Self-Declare</span>
                  </label>
                </div>
              </div>

              {/* Route Select */}
              {verificationRequired && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Route Type</label>
                    <select
                      value={verificationType}
                      onChange={(e) => setVerificationType(e.target.value)}
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 bg-white text-slate-900 focus:outline-none"
                    >
                      <option value="FACULTY_TG">FACULTY / TG REVIEW</option>
                      <option value="EVENT_COORDINATOR">EVENT COORDINATOR REVIEW</option>
                      <option value="ADMIN_INSTITUTIONAL">ADMINISTRATIVE AUDIT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Authority Level</label>
                    <select
                      value={verificationAuthority}
                      onChange={(e) => setVerificationAuthority(e.target.value)}
                      className="border border-slate-350 rounded-lg w-full px-3 py-2 bg-white text-slate-900 focus:outline-none"
                    >
                      <option value="FACULTY">FACULTY TG</option>
                      <option value="COORDINATOR">COORDINATOR / SIG HEAD</option>
                      <option value="HOD">HOD / REGISTRAR</option>
                    </select>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedRule(null)}
                  className="px-3.5 py-2 border border-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  <span>Save Config</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
