
export interface Student {
  no: string;
  nisn: string;
  nama: string;
}

export interface Attendance {
  sakit: number;
  izin: number;
  alfa: number;
}

export interface GradeData {
  materi: number[];
  rataRata: number;
}

export type SubjectKey = 
  | 'presensi' 
  | 'pancasila' 
  | 'indonesia' 
  | 'matematika' 
  | 'ipas' 
  | 'inggris' 
  | 'seni' 
  | 'sunda' 
  | 'plh';

export interface AppData {
  students: Student[];
  attendance: Record<string, Attendance>; // key: NISN
  grades: Record<SubjectKey, Record<string, GradeData>>; // key: Subject -> NISN -> Data
}
