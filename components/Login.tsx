
import React, { useState } from 'react';
import { Student } from '../types';

interface LoginProps {
  onLogin: (nisn: string) => void;
  isLoading: boolean;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [nisn, setNisn] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nisn.trim()) {
      onLogin(nisn.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all hover:scale-[1.01]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path d="M12 14l9-5-9-5-9 5 9 5z" />
               <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
             </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-900 text-center">Halo, Siswa 5A!</h1>
          <p className="text-blue-500 text-sm mt-1">Silakan masuk menggunakan NISN kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nisn" className="block text-sm font-semibold text-blue-700 mb-2">
              Nomor Induk Siswa Nasional (NISN)
            </label>
            <input
              type="text"
              id="nisn"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              placeholder="Masukkan 10 digit NISN"
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-lg font-medium"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !nisn}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Masuk Sekarang"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-blue-50 text-center">
          <p className="text-xs text-blue-400 font-medium">SDN 019 Pabaki © 2024</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
