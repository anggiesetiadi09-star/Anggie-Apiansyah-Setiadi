
import { AppData, Student, Attendance, GradeData, SubjectKey } from '../types';
import { CSV_URLS } from '../constants';

const parseCSV = (text: string): string[][] => {
  // Menangani line endings Windows (\r\n) dan Unix (\n)
  const rows = text.split(/\r?\n/);
  return rows
    .filter(row => row.trim().length > 0) // Abaikan baris kosong
    .map(row => {
      const result: string[] = [];
      let startValueIndex = 0;
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '"') inQuotes = !inQuotes;
        if (row[i] === ',' && !inQuotes) {
          result.push(row.substring(startValueIndex, i).replace(/^"|"$/g, '').trim());
          startValueIndex = i + 1;
        }
      }
      result.push(row.substring(startValueIndex).replace(/^"|"$/g, '').trim());
      return result;
    });
};

export const fetchAllData = async (): Promise<AppData> => {
  const appData: AppData = {
    students: [],
    attendance: {},
    grades: {
      presensi: {},
      pancasila: {},
      indonesia: {},
      matematika: {},
      ipas: {},
      inggris: {},
      seni: {},
      sunda: {},
      plh: {}
    }
  };

  try {
    // 1. Ambil Data Presensi & Daftar Siswa
    const presensiRes = await fetch(CSV_URLS.presensi);
    if (!presensiRes.ok) throw new Error("Gagal mengambil data presensi");
    const presensiText = await presensiRes.text();
    const presensiData = parseCSV(presensiText);

    if (presensiData.length < 2) throw new Error("Data presensi kosong atau tidak valid");

    // Cari indeks kolom secara dinamis (antisipasi jika posisi kolom berubah)
    const header = presensiData[0].map(h => h.toUpperCase());
    const idxNama = header.findIndex(h => h.includes('NAMA'));
    const idxNisn = header.findIndex(h => h.includes('NISN'));
    const idxS = header.findIndex(h => h === 'S' || h.includes('SAKIT'));
    const idxI = header.findIndex(h => h === 'I' || h.includes('IZIN'));
    const idxA = header.findIndex(h => h === 'A' || h.includes('ALFA') || h.includes('KETERANGAN'));

    // Gunakan indeks default jika tidak ditemukan
    const finalIdxNama = idxNama !== -1 ? idxNama : 1;
    const finalIdxNisn = idxNisn !== -1 ? idxNisn : 2;
    const finalIdxS = idxS !== -1 ? idxS : 3;
    const finalIdxI = idxI !== -1 ? idxI : 4;
    const finalIdxA = idxA !== -1 ? idxA : 5;

    presensiData.slice(1).forEach(row => {
      const nisn = row[finalIdxNisn];
      const nama = row[finalIdxNama];
      
      // Validasi NISN (minimal ada isinya dan bukan kata "NISN")
      if (!nisn || nisn.toUpperCase() === 'NISN') return;

      appData.students.push({ 
        no: row[0] || '', 
        nisn: nisn, 
        nama: nama || 'Tanpa Nama' 
      });
      
      appData.attendance[nisn] = {
        sakit: parseInt(row[finalIdxS]) || 0,
        izin: parseInt(row[finalIdxI]) || 0,
        alfa: parseInt(row[finalIdxA]) || 0
      };
    });

    // 2. Ambil Nilai untuk setiap mata pelajaran
    const subjectKeys = Object.keys(CSV_URLS).filter(k => k !== 'presensi') as SubjectKey[];
    
    await Promise.all(subjectKeys.map(async (key) => {
      try {
        const res = await fetch(CSV_URLS[key]);
        if (!res.ok) return;
        const text = await res.text();
        const rows = parseCSV(text);

        if (rows.length < 2) return;

        const subHeader = rows[0].map(h => h.toUpperCase());
        const subIdxNisn = subHeader.findIndex(h => h.includes('NISN'));
        const finalSubIdxNisn = subIdxNisn !== -1 ? subIdxNisn : 2;

        rows.slice(1).forEach(row => {
          const nisn = row[finalSubIdxNisn];
          if (!nisn || nisn.toUpperCase() === 'NISN') return;

          // Ambil 10 materi setelah kolom NISN (asumsi kolom 3-12)
          const gradesArray = row.slice(finalSubIdxNisn + 1, finalSubIdxNisn + 11).map(v => {
            const num = parseInt(v);
            return isNaN(num) ? 0 : num;
          });

          const validGrades = gradesArray.filter(g => g > 0);
          const sum = gradesArray.reduce((acc, curr) => acc + curr, 0);
          const average = validGrades.length > 0 ? sum / validGrades.length : 0;

          appData.grades[key][nisn] = {
            materi: gradesArray,
            rataRata: parseFloat(average.toFixed(2))
          };
        });
      } catch (e) {
        console.warn(`Gagal memuat mata pelajaran: ${key}`, e);
      }
    }));

    return appData;
  } catch (error) {
    console.error("Fetch error details:", error);
    throw error;
  }
};
