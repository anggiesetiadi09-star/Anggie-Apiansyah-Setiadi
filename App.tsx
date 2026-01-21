
import React, { useState, useEffect } from 'react';
import { AppData, Student } from './types';
import { fetchAllData } from './services/dataService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const result = await fetchAllData();
        setData(result);
        if (result.students.length === 0) {
          setError("Data siswa kosong. Periksa apakah Google Sheets sudah di-publish ke web dalam format CSV.");
        }
      } catch (err) {
        setError("Gagal memuat data. Periksa koneksi internet atau status publish Google Sheets.");
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  const handleLogin = (nisn: string) => {
    if (!data) return;
    setLoginError(null);

    // Normalisasi input dan data untuk perbandingan yang lebih akurat
    const normalizedInput = nisn.trim();
    const student = data.students.find(s => s.nisn.trim() === normalizedInput);

    if (student) {
      setLoggedInStudent(student);
      localStorage.setItem('loggedInNisn', normalizedInput);
    } else {
      setLoginError(`NISN '${normalizedInput}' tidak ditemukan. Silakan cek kembali atau hubungi wali kelas.`);
      console.log("NISN yang tersedia:", data.students.map(s => s.nisn));
    }
  };

  const handleLogout = () => {
    setLoggedInStudent(null);
    localStorage.removeItem('loggedInNisn');
  };

  useEffect(() => {
    if (data && !loggedInStudent) {
      const storedNisn = localStorage.getItem('loggedInNisn');
      if (storedNisn) {
        const student = data.students.find(s => s.nisn.trim() === storedNisn.trim());
        if (student) setLoggedInStudent(student);
      }
    }
  }, [data, loggedInStudent]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600 text-xs">5A</div>
        </div>
        <p className="mt-6 text-blue-600 font-bold animate-pulse text-lg">Membuka Lemari Raport...</p>
        <p className="text-blue-400 text-sm mt-2">Sedang sinkronisasi dengan data sekolah</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-blue-200 max-w-lg border-2 border-red-50">
          <div className="text-6xl mb-6">🎒</div>
          <h1 className="text-2xl font-black text-blue-900 mb-3">Aplikasi Sedang Istirahat</h1>
          <p className="text-blue-600/70 mb-8 font-medium leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all w-full"
          >
            Coba Segarkan Halaman
          </button>
        </div>
      </div>
    );
  }

  if (!loggedInStudent) {
    return (
      <Login 
        onLogin={handleLogin} 
        isLoading={isLoading} 
        error={loginError} 
      />
    );
  }

  return (
    <Dashboard 
      student={loggedInStudent} 
      data={data!} 
      onLogout={handleLogout} 
    />
  );
};

export default App;
