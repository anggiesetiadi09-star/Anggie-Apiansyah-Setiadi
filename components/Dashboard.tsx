
import React, { useState } from 'react';
import { AppData, Student, SubjectKey } from '../types';
import { SUBJECT_LABELS, SUBJECT_ORDER } from '../constants';

interface DashboardProps {
  student: Student;
  data: AppData;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ student, data, onLogout }) => {
  const [activeTab, setActiveTab] = useState<SubjectKey>('presensi');

  const attendance = data.attendance[student.nisn] || { sakit: 0, izin: 0, alfa: 0 };
  const currentGrade = activeTab !== 'presensi' ? data.grades[activeTab][student.nisn] : null;

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-100">
              {student.nama.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-900 leading-tight">{student.nama}</h2>
              <p className="text-sm font-medium text-blue-500">NISN: {student.nisn} • Kelas 5A</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {SUBJECT_ORDER.map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as SubjectKey)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === key
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-y-[-2px]'
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
              >
                {SUBJECT_LABELS[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-6 md:p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-8 border-b border-blue-50 pb-6">
            <h3 className="text-2xl font-bold text-blue-900">
              Detail {SUBJECT_LABELS[activeTab]}
            </h3>
            {activeTab !== 'presensi' && currentGrade && (
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Rata-rata</span>
                <span className="text-3xl font-black text-blue-600">{currentGrade.rataRata}</span>
              </div>
            )}
          </div>

          {activeTab === 'presensi' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AttendanceCard label="Sakit" count={attendance.sakit} color="yellow" icon="🤒" />
              <AttendanceCard label="Izin" count={attendance.izin} color="green" icon="📄" />
              <AttendanceCard label="Tanpa Keterangan" count={attendance.alfa} color="red" icon="❌" />
            </div>
          ) : (
            <div>
              {currentGrade ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {currentGrade.materi.map((score, index) => (
                    <div key={index} className="group relative bg-blue-50 rounded-2xl p-6 transition-all hover:bg-blue-100/50 hover:shadow-inner">
                      <div className="absolute top-3 left-3 text-[10px] font-bold text-blue-300 uppercase">Materi {index + 1}</div>
                      <div className="mt-4 flex flex-col items-center">
                        <span className={`text-4xl font-black ${score >= 75 ? 'text-blue-700' : 'text-orange-500'}`}>
                          {score}
                        </span>
                        <div className="mt-2 h-1 w-12 bg-blue-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${score >= 75 ? 'bg-blue-600' : 'bg-orange-500'}`} 
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-blue-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="font-bold text-lg text-blue-400">Belum ada data nilai</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Quote/Motivation */}
        <div className="mt-8 bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">Pesan Untuk Hari Ini ✨</h4>
            <p className="text-blue-100 font-medium">"Pendidikan adalah senjata paling ampuh yang bisa kamu gunakan untuk mengubah dunia. Terus semangat belajarnya ya!"</p>
          </div>
          <div className="absolute top-[-20px] right-[-20px] opacity-10 rotate-12">
             <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.3H3.73L12 5.45z"/>
             </svg>
          </div>
        </div>
      </main>

      <footer className="mt-12 py-8 text-center text-blue-400 text-sm font-medium border-t border-blue-100">
        SDN 019 Pabaki • Jalan Pabaki No. 19 • Bandung
      </footer>
    </div>
  );
};

const AttendanceCard: React.FC<{ label: string; count: number; color: 'yellow' | 'green' | 'red'; icon: string }> = ({ label, count, color, icon }) => {
  const colors = {
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    red: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  const countColors = {
    yellow: 'text-yellow-600',
    green: 'text-emerald-600',
    red: 'text-rose-600'
  }

  return (
    <div className={`p-8 rounded-3xl border-2 ${colors[color]} transition-transform hover:scale-[1.02]`}>
      <div className="text-4xl mb-4">{icon}</div>
      <div className="text-sm font-bold uppercase tracking-widest opacity-60 mb-1">{label}</div>
      <div className={`text-6xl font-black ${countColors[color]}`}>{count}</div>
      <div className="text-xs font-bold mt-2 opacity-50">HARI</div>
    </div>
  );
};

export default Dashboard;
