export interface MenuItemType {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

export interface Vaccine {
  id: string;
  name: string;
  clinicId: string;
}

export interface VaccineStock {
  vaccineId: string;
  quantity: number;
}

export interface Clinic {
  id: string;
  name: string;
  vaccines: VaccineStock[];
}