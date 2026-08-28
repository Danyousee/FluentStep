import React, { useState } from 'react';
import {
  Award,
  GraduationCap,
  Share2,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PlatformCertificate } from '../types';

export const CertificatesView: React.FC = () => {
  const { certificates, activeCertificateId, setActiveCertificateId, setCurrentView } = useApp();

  const selectedCert: PlatformCertificate | undefined =
    certificates.find((c) => c.id === activeCertificateId) || certificates[0];

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!selectedCert) return;
    navigator.clipboard.writeText(selectedCert.verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!selectedCert) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 space-y-4">
        <GraduationCap size={48} className="text-indigo-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          No Certificates Yet
        </h2>
        <p className="text-slate-500 text-sm">
          Complete an AI course or pass a final exam to earn your verified Certificate of
          Achievement.
        </p>
        <button
          onClick={() => setCurrentView('course_generator')}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow"
        >
          Explore AI Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold mb-2">
            <Award size={14} />
            <span>Academic Credentials & Badges</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            My Verified Certificates
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2"
          >
            <Share2 size={16} />
            <span>{copied ? 'Link Copied!' : 'Share Credential'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Certificate Card (Designed for High-End Prestige) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 border-8 border-double border-amber-300/60 dark:border-amber-700/50 rounded-3xl p-8 sm:p-14 shadow-2xl space-y-8 text-center">
        {/* Corner Accents */}
        <div className="absolute top-4 left-4 text-amber-500/40 text-2xl font-serif">✦</div>
        <div className="absolute top-4 right-4 text-amber-500/40 text-2xl font-serif">✦</div>
        <div className="absolute bottom-4 left-4 text-amber-500/40 text-2xl font-serif">✦</div>
        <div className="absolute bottom-4 right-4 text-amber-500/40 text-2xl font-serif">✦</div>

        {/* Top Seal & Heading */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 mx-auto flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-amber-500/20 border-2 border-white">
            🎓
          </div>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-indigo-900 dark:text-indigo-400">
            FluentStep Global English Institute
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Certificate of Achievement
          </h2>
        </div>

        {/* Recipient */}
        <div className="space-y-2 py-4 border-y border-amber-200/60 dark:border-slate-800">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            This is proudly presented to
          </p>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-serif">
            {selectedCert.studentName}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            for successfully completing all modules, speaking fluency evaluations, and the final comprehensive examination for:
          </p>
          <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
            {selectedCert.courseTitle}
          </p>
        </div>

        {/* Skills & Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left">
          <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Proficiency Level</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{selectedCert.level}</span>
          </div>
          <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Final Score</span>
            <span className="text-xs font-bold text-emerald-600">{selectedCert.scorePercent}% Distinction</span>
          </div>
          <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Hours Logged</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedCert.hoursSpent} Hours</span>
          </div>
          <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Date</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedCert.completionDate}</span>
          </div>
        </div>

        {/* Signatures & Verification Code */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-amber-200/60 dark:border-slate-800 text-xs">
          <div className="text-left space-y-1">
            <p className="font-serif italic text-base text-slate-800 dark:text-slate-200">Sarah Jenkins</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Director of Academic AI</p>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold rounded-lg border border-amber-300 dark:border-amber-800">
              <ShieldCheck size={14} />
              <span>ID: {selectedCert.certificateNumber}</span>
            </div>
            <p className="text-[10px] text-slate-400 block">Verified on FluentStep Ledger</p>
          </div>
        </div>
      </div>

      {/* All Certificates List */}
      {certificates.length > 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            All Earned Certificates ({certificates.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setActiveCertificateId(cert.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  cert.id === selectedCert.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50'
                }`}
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {cert.courseTitle}
                  </h4>
                  <p className="text-xs text-slate-400">{cert.completionDate} • {cert.level}</p>
                </div>
                <span className="text-xs text-indigo-600 font-bold">View</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
