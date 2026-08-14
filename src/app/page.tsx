// src/app/page.tsx
'use client';

import Link from 'next/link';
import { 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  HelpCircle, 
  Info, 
  Database, 
  BookOpen, 
  Users, 
  CheckSquare, 
  FileText, 
  School, 
  TrendingUp, 
  ArrowDown, 
  Menu, 
  X,
  Lock,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-900 selection:text-white">
      
      {/* SECTION 1 — NAVBAR */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-200 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-indigo-900 text-white p-2 rounded-lg shadow-sm">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
              Student Development Passport
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-indigo-900 transition-colors">Home</a>
            <a href="#how-it-works" className="hover:text-indigo-900 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-indigo-900 transition-colors">Features</a>
            <a href="#verification" className="hover:text-indigo-900 transition-colors">Verification</a>
            <a href="#about" className="hover:text-indigo-900 transition-colors">About</a>
          </nav>

          {/* Nav CTAs */}
          <div className="hidden md:flex items-center space-x-3.5">
            <Link 
              href="/login" 
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="inline-flex items-center px-4 py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
            >
              <span>Open Passport</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 md:hidden hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3 shadow-md animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3 text-xs font-semibold text-slate-600">
              <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-900 py-1 transition-colors">Home</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-900 py-1 transition-colors">How It Works</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-900 py-1 transition-colors">Features</a>
              <a href="#verification" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-900 py-1 transition-colors">Verification</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-indigo-900 py-1 transition-colors">About</a>
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                Open Passport
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* HERO LEFT COLUMN */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="inline-flex px-3 py-1 bg-indigo-50 border border-indigo-150 rounded-full text-[10px] font-bold text-indigo-950 uppercase tracking-widest">
            Student Development Platform
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.1]">
            Your development journey, <br />
            <span className="text-indigo-900">in one trusted record.</span>
          </h1>
          <p className="text-slate-650 text-sm sm:text-base leading-relaxed max-w-xl">
            Keep your academic context, activities, projects, achievements and learning in one structured Student Development Passport — with the right level of evidence and verification for every record.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center px-5 py-3 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer text-center"
            >
              <span>Open My Passport</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <a 
              href="#how-it-works" 
              className="inline-flex items-center justify-center px-5 py-3 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl shadow-sm transition-all text-center"
            >
              See How It Works
            </a>
          </div>
        </div>

        {/* HERO RIGHT COLUMN — REALISTIC PASSPORT PREVIEW */}
        <div className="lg:col-span-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto">
            {/* Header branding */}
            <div className="bg-indigo-950 p-5 text-white flex justify-between items-center border-b border-indigo-900">
              <div>
                <span className="text-[9px] uppercase font-extrabold tracking-wider bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded">
                  Student Passport Preview
                </span>
                <h4 className="text-base font-extrabold mt-1">Rohan Sharma</h4>
                <p className="text-[10px] text-indigo-300">Roll: 2026-CSE-004 &bull; Computer Engineering</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded text-center shrink-0">
                <span className="text-[9px] text-emerald-400 font-bold block uppercase">CGPA</span>
                <span className="text-sm font-black text-emerald-400 leading-none">8.40</span>
              </div>
            </div>

            {/* Passport Statistics */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-3 gap-3 text-center text-xs font-semibold">
              <div className="bg-white border border-slate-150 rounded-lg p-2">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Verified</span>
                <span className="text-base font-extrabold text-emerald-600 block mt-0.5">8</span>
              </div>
              <div className="bg-white border border-slate-150 rounded-lg p-2">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Pending</span>
                <span className="text-base font-extrabold text-amber-600 block mt-0.5">1</span>
              </div>
              <div className="bg-white border border-slate-150 rounded-lg p-2">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Self-Declared</span>
                <span className="text-base font-extrabold text-blue-600 block mt-0.5">3</span>
              </div>
            </div>

            {/* Timelines snapshot */}
            <div className="p-5 space-y-4">
              <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recent Development Ledger</h5>
              
              <div className="space-y-3 text-xs">
                {/* Item 1 */}
                <div className="flex justify-between items-start border-l-2 border-emerald-500 pl-3">
                  <div>
                    <h6 className="font-bold text-slate-900">Internship (Software Engineer at TCS)</h6>
                    <span className="text-[10px] text-slate-400">Academic &bull; Completed July 2026</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-150 uppercase shrink-0">
                    Verified
                  </span>
                </div>

                {/* Item 2 */}
                <div className="flex justify-between items-start border-l-2 border-amber-500 pl-3">
                  <div>
                    <h6 className="font-bold text-slate-900">Smart Campus Platform Project</h6>
                    <span className="text-[10px] text-slate-400">Team Project &bull; My Contribution: Backend Developer</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-150 uppercase shrink-0">
                    Pending
                  </span>
                </div>

                {/* Item 3 */}
                <div className="flex justify-between items-start border-l-2 border-blue-500 pl-3">
                  <div>
                    <h6 className="font-bold text-slate-900">React.js Learning (YouTube)</h6>
                    <span className="text-[10px] text-slate-400">Self-learning &bull; Completed June 2026</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-150 uppercase shrink-0">
                    Self-Declared
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <Link 
                href="/login" 
                className="text-[11px] font-bold text-indigo-900 hover:text-indigo-950 inline-flex items-center"
              >
                <span>Access Live Passport Interface</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / VALUE STRIP */}
      <section className="bg-white border-y border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-900">
              <BookOpen className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider">One Structured Record</h4>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">Academic context and development activities mapped together.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-900">
              <CheckSquare className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Appropriate Verification</h4>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">Records route automatically to the correct approving authority.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-900">
              <Shield className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Clear Trust Levels</h4>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">Verified items and self-declared study records remain distinct.</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-900">
              <Database className="w-4 h-4" />
              <h4 className="font-bold text-xs uppercase tracking-wider">Reusable Data</h4>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">One passport powers reports, analysis dashboards, and credentials.</p>
          </div>

        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">The Fragmentation Problem</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            A student's development is more than a certificate.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Hackathons, workshops, projects, internships, self-learning and achievements often end up scattered across forms, spreadsheets, messages, certificates and separate records.
          </p>
        </div>

        {/* Minimal fragmentation flowchart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-3 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">Google Forms</div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">Excel Sheets</div>
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">Hard Certificates</div>
          </div>
          
          <div className="flex flex-col items-center my-4 text-slate-400">
            <ArrowDown className="w-5 h-5 animate-bounce" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-red-650 my-1 bg-red-50 border border-red-150 px-2.5 py-0.5 rounded">
              Fragmented & Unverified Records
            </span>
            <ArrowDown className="w-5 h-5" />
          </div>

          <div className="bg-indigo-950 text-white rounded-xl p-5 flex items-center justify-between shadow-md text-left">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <h5 className="font-extrabold text-xs sm:text-sm">Student Development Passport</h5>
                <p className="text-[10px] sm:text-xs text-indigo-300">Centralized, evidence-linked, and structured academic passport ledger.</p>
              </div>
            </div>
            <Link 
              href="/login" 
              className="bg-white text-indigo-950 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 shrink-0 shadow-sm transition-colors"
            >
              Open Live Page
            </Link>
          </div>
        </div>
      </section>

      {/* CORE DIFFERENTIATOR */}
      <section id="features" className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Flexible Verification Engine</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Not every record needs the same proof.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              We classify submissions into four core trust categories, routing each through its respective institutional pathway.
            </p>
          </div>

          {/* Differentiator columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="border border-slate-200 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs uppercase text-slate-900">1. Institutional</span>
                <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-extrabold text-slate-600 rounded uppercase">Core DB</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">Official academic stats supplied directly from the Registrar's database.</p>
              <ul className="text-[11px] font-semibold text-slate-700 space-y-1 bg-slate-55 p-2 rounded">
                <li>&bull; Current Semester / Batch</li>
                <li>&bull; Cumulative GPA (CGPA)</li>
                <li>&bull; Attendance Average</li>
              </ul>
            </div>

            <div className="border border-slate-200 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs uppercase text-slate-900">2. Event / SIG</span>
                <span className="px-2 py-0.5 bg-amber-50 text-[9px] font-extrabold text-amber-700 rounded uppercase">Coord Path</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">Co-curricular logs audited and approved by SIG club heads and event managers.</p>
              <ul className="text-[11px] font-semibold text-slate-700 space-y-1 bg-slate-55 p-2 rounded">
                <li>&bull; Hackathons (e.g. MumbaiHacks)</li>
                <li>&bull; Technical Workshops</li>
                <li>&bull; Club & Society Leadership</li>
              </ul>
            </div>

            <div className="border border-slate-200 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs uppercase text-slate-900">3. Faculty / TG</span>
                <span className="px-2 py-0.5 bg-indigo-50 text-[9px] font-extrabold text-indigo-700 rounded uppercase">Advisor Path</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">High-impact project contributions and internships reviewed by Teacher Guardians.</p>
              <ul className="text-[11px] font-semibold text-slate-700 space-y-1 bg-slate-55 p-2 rounded">
                <li>&bull; Project Work & Role Specs</li>
                <li>&bull; Corporate Internships</li>
                <li>&bull; Research Publications</li>
              </ul>
            </div>

            <div className="border border-slate-200 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-xs uppercase text-slate-900">4. Self-Declared</span>
                <span className="px-2 py-0.5 bg-blue-50 text-[9px] font-extrabold text-blue-700 rounded uppercase">Direct Path</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">Low-risk personal studies logged by students without mandatory formal seals.</p>
              <ul className="text-[11px] font-semibold text-slate-700 space-y-1 bg-slate-55 p-2 rounded">
                <li>&bull; YouTube Learning Tracks</li>
                <li>&bull; Unhosted Project Code</li>
                <li>&bull; Personal Reading Logs</li>
              </ul>
            </div>

          </div>

          {/* Differentiator Banner */}
          <div className="bg-red-50/70 border border-red-200 rounded-xl p-5 max-w-2xl mx-auto flex items-start space-x-3.5">
            <Info className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-red-950 uppercase tracking-wider text-xs block">No proof required does not mean verified.</span>
              <p className="text-slate-650 text-xs mt-1 leading-relaxed">
                Self-declared records display a neutral badge to differentiate them from verified records. This protects the integrity of the passport for academic and external use.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* VERIFICATION WORKFLOW */}
      <section id="verification" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Routing Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            The right record reaches the right person.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Every submission triggers a classification engine that routes the record to the correct approving authority with its evidence.
          </p>
        </div>

        {/* Workflow schematic */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
          {/* Horizontal flow line */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400">1. Student Activity</span>
              <h6 className="font-bold text-slate-900 text-xs mt-1">Record Submitted</h6>
            </div>
            
            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400">2. Classification</span>
              <h6 className="font-bold text-slate-900 text-xs mt-1">Route Checked</h6>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400">3. Verification Link</span>
              <h6 className="font-bold text-slate-900 text-xs mt-1">Evidence Required</h6>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400">4. Review Authority</span>
              <h6 className="font-bold text-slate-900 text-xs mt-1">Staff Queue</h6>
            </div>

            <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center col-span-2 md:col-span-1">
              <span className="text-[9px] uppercase font-bold text-slate-400">5. Passport Update</span>
              <h6 className="font-bold text-indigo-950 text-xs mt-1">Passport Ledger</h6>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-semibold">
            {/* Left box: Authorities */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase text-slate-700 tracking-wider">Review Authorities</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span>Institution Admin</span>
                  <span className="text-[10px] text-slate-500 font-mono">Academic Records</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span>Event & Club Coordinators</span>
                  <span className="text-[10px] text-slate-500 font-mono">Co-curricular SIGs</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span>Faculty & Teacher Guardians</span>
                  <span className="text-[10px] text-slate-500 font-mono">Project Contributions</span>
                </div>
              </div>
            </div>

            {/* Right box: Badge Styles */}
            <div className="space-y-3">
              <h5 className="font-bold text-xs uppercase text-slate-700 tracking-wider">Status Indicators</h5>
              <div className="flex flex-wrap gap-2.5">
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-150 text-[10px] uppercase font-bold">
                  ✓ Verified
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-amber-50 text-amber-700 border border-amber-150 text-[10px] uppercase font-bold">
                  ◷ Pending
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-orange-50 text-orange-700 border border-orange-150 text-[10px] uppercase font-bold">
                  ◷ Returned
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-150 text-[10px] uppercase font-bold">
                  ✕ Rejected
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-150 text-[10px] uppercase font-bold">
                  ? Self-Declared
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                These status badges are identical to those displayed inside the live dashboard queues, keeping audit checks consistent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-indigo-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Chronological Stages</span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              From activity to trusted record.
            </h2>
            <p className="text-indigo-300 text-xs sm:text-sm leading-relaxed">
              Six simple phases that compile a verified passport portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-indigo-900/50 border border-indigo-900 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-indigo-400 font-mono">01</span>
              <h4 className="font-extrabold text-sm text-white">Capture Once</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">Log your activity or project in the database. No double entries.</p>
            </div>

            <div className="bg-indigo-900/50 border border-indigo-900 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-indigo-400 font-mono">02</span>
              <h4 className="font-extrabold text-sm text-white">Classify Correctly</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">Select the activity type. The engine auto-assigns the trust route.</p>
            </div>

            <div className="bg-indigo-900/50 border border-indigo-900 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-indigo-400 font-mono">03</span>
              <h4 className="font-extrabold text-sm text-white">Attach Evidence</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">Upload certificates, screenshots, or write code contribution details.</p>
            </div>

            <div className="bg-indigo-900/50 border border-indigo-900 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-indigo-400 font-mono">04</span>
              <h4 className="font-extrabold text-sm text-white">Appropriate Verification</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">Reviewers approve, return for revision, or reject submissions.</p>
            </div>

            <div className="bg-indigo-900/50 border border-indigo-900 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-indigo-400 font-mono">05</span>
              <h4 className="font-extrabold text-sm text-white">Passport Integration</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">The verified record joins your permanent development timeline.</p>
            </div>

            <div className="bg-indigo-900/50 border border-indigo-900 p-5 rounded-xl space-y-2">
              <span className="text-2xl font-black text-indigo-400 font-mono">06</span>
              <h4 className="font-extrabold text-sm text-white">Reuse Everywhere</h4>
              <p className="text-indigo-200 text-xs leading-relaxed">Export print-ready PDF reports or search records in student registers.</p>
            </div>

          </div>
        </div>
      </section>

      {/* INDIVIDUAL CONTRIBUTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill Integrity</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            A team project should not become everyone's skill list.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Projects belong to the team. The specific contributions belong to the individual.
          </p>
        </div>

        {/* Contribution visual preview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Project: Smart Campus Platform</h4>
              <p className="text-[10px] text-slate-500">Collaborative Academic Hackathon Project</p>
            </div>
            <span className="px-2 py-0.5 bg-slate-100 text-[10px] text-slate-650 rounded font-mono font-semibold">Team Size: 4</span>
          </div>

          <div className="overflow-x-auto text-[11px] sm:text-xs">
            <table className="min-w-full divide-y divide-slate-150 text-left font-medium">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Assigned Role</th>
                  <th className="px-3 py-2">Verified Skill Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="px-3 py-2.5 font-bold text-slate-900">Rohan Sharma</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-600">Backend Developer</td>
                  <td className="px-3 py-2.5">Built REST APIs in Node.js and PostgreSQL schema integration.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-bold text-slate-900">Student B</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-600">Frontend Engineer</td>
                  <td className="px-3 py-2.5">Designed state hooks and React components in Next.js.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-bold text-slate-900">Student C</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-600">Database Admin</td>
                  <td className="px-3 py-2.5">Managed index optimization and migration script rollouts.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-bold text-slate-900">Student D</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-600">UI/UX Designer</td>
                  <td className="px-3 py-2.5">Constructed figma mockups and responsive Tailwind CSS layout.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-semibold gap-3">
            <span>Flow: Project Sub &rarr; Student Role Selection &rarr; Contribution Logging &rarr; Faculty Sign-off</span>
            <Link href="/login" className="text-indigo-900 hover:text-indigo-950 font-bold uppercase tracking-wider">
              Try Recording Project &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* STUDENT + INSTITUTION VALUE */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Students column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-900">
              <Users className="w-5 h-5" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">For Students</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-650 leading-relaxed font-semibold">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span>One place for all academic and extra-curricular development records.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span>Real-time status updates from coordinators and teacher guardians.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span>Specific contribution fields to claim credit for team projects.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span>Official PDF Student Development Reports generated on demand.</span>
              </li>
            </ul>
          </div>

          {/* Institutions column */}
          <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-250 pt-8 md:pt-0 md:pl-8">
            <div className="flex items-center space-x-2 text-indigo-900">
              <School className="w-5 h-5" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider">For Institutions</h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-650 leading-relaxed font-semibold">
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span>Centralized database of students, programs, and departments.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span>Dedicated audit interfaces for faculty and club coordinators.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span>Campus-wide student search registry for HODs and administrators.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-600 font-bold mr-2">✓</span>
                <span>Data layer designed to complement existing ERP/SIS structures.</span>
              </li>
            </ul>
          </div>

        </div>
        <div className="text-center pt-8 text-[11px] text-slate-400 font-medium italic">
          Designed as a student-development layer that works alongside existing institutional systems.
        </div>
      </section>

      {/* CAPTURE ONCE -> REUSE EVERYWHERE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unified Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Capture Once. Reuse Everywhere.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            One data collection point enables infinite reuse across evaluation and planning flows.
          </p>
        </div>

        {/* Reuse Flow diagram */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm max-w-xl mx-auto text-xs font-semibold text-slate-700">
          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-900 font-bold">
              Student Activity Submission
            </div>
            <div className="text-slate-400">&darr;</div>
            
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-indigo-900 font-bold">
              Student Passport Database Ledger
            </div>
            <div className="text-slate-400">&darr;</div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                Faculty / Coord Review
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                HOD Institutional Search
              </div>
            </div>
            <div className="text-slate-400">&darr;</div>

            <div className="bg-slate-55 p-2.5 rounded-lg border border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              Student Development Report PDF
            </div>

            <div className="text-slate-400">&darr;</div>
            <div className="bg-slate-100 p-2 rounded border border-dashed border-slate-300 text-slate-400 font-bold uppercase text-[9px]">
              Future Portfolio / Resume / Career Extensions
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE VISION */}
      <section id="about" className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Extensible Design</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              A foundation that can grow with the student.
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Once development records are structured and appropriately verified, the same foundation can support future capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-2">
              <span className="text-[9px] uppercase font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">Future Extension</span>
              <h4 className="font-extrabold text-slate-900 mt-1">Demonstrated Skills</h4>
              <p className="text-slate-500 leading-relaxed">Extracting and mapping verified technologies from project logs to skill levels.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-2">
              <span className="text-[9px] uppercase font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">Future Extension</span>
              <h4 className="font-extrabold text-slate-900 mt-1">e-Portfolio & Resume</h4>
              <p className="text-slate-500 leading-relaxed">Automatically generating official credentials and verified portfolios for recruiters.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-2">
              <span className="text-[9px] uppercase font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">Future Extension</span>
              <h4 className="font-extrabold text-slate-900 mt-1">Career Roadmap</h4>
              <p className="text-slate-500 leading-relaxed">Matching verified skill graphs to target career pathways and corporate profiles.</p>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-8">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest bg-indigo-50 border border-indigo-150 px-2.5 py-1 rounded-full">Get Started</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Build a record of what <br className="sm:hidden" /> you've actually done.
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Your academic journey is more than marks. Capture the learning, experiences and contributions that shape your development.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            href="/login" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Open My Passport</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <a 
            href="#how-it-works" 
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-350 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Explore How It Works
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-indigo-950 text-slate-400 py-12 border-t border-indigo-900 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Footer Branding */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <Award className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm">Student Development Passport</span>
            </div>
            <p className="text-indigo-200/60 max-w-sm leading-relaxed">
              A centralized, evidence-aware, and appropriately verified student activity and development record for higher education institutions.
            </p>
          </div>

          {/* Footer links */}
          <div className="md:col-span-6 md:justify-self-end space-y-4">
            <h5 className="font-bold text-[10px] uppercase text-white tracking-wider">Useful Routes</h5>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-indigo-200/60 font-semibold">
              <a href="#hero" className="hover:text-white transition-colors">Home</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#verification" className="hover:text-white transition-colors">Verification</a>
              <Link href="/login" className="hover:text-white transition-colors font-bold text-indigo-400">Sign In</Link>
            </div>
          </div>

        </div>

        {/* Footer legal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-indigo-900/60 flex flex-col sm:flex-row justify-between items-center text-[10px] text-indigo-305/40 font-semibold gap-3">
          <span>SIH25093 &bull; Student Development Passport</span>
          <span>&copy; {new Date().getFullYear()} SIH Internal Sandbox. All Rights Reserved.</span>
        </div>
      </footer>

    </div>
  );
}
