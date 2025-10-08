export interface Diagnosis {
  title: string;
  cie: string;
  date: string;
  description: string;
}

export interface Medication {
  name: string;
  dosage: string;
}

export interface Patient {
  id: number;
  initials: string;
  name: string;
  diagnosis: string;
  lastVisit: string;
  status: "active" | "in-progress" | "inactive";
  age?: number;
  gender?: string;
  since?: string;
  idCode?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  diagnosisDetail?: Diagnosis;
  medicationDetail?: Medication[];
}
 