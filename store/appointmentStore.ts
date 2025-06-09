import { create } from "zustand";
import { persist } from "zustand/middleware";
import useVaccineInventoryStore from "./vaccineInventoryStore";
import type { Vaccine } from "@/type";
export interface VaccinationHistoryItem {
  name: string;
  date: string;
  dose: string;
}

export interface Appointment {
  key: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  preferredDate: string;
  preferredTime: string;
  vaccineType: string;
  status: "Pending" | "Scheduled" | "Rejected" | "Completed"; // ubah Approved jadi Scheduled
  gender?: string;
  dob?: string;
  vaccinationHistory?: VaccinationHistoryItem[];
}

interface AppointmentState {
  appointments: Appointment[];
  setAppointments: (data: Appointment[]) => void;
  updateStatus: (key: string, status: Appointment["status"]) => void;
  updateStatusAndStock: (key: string, newStatus: Appointment["status"]) => boolean; // <-- ubah void jadi boolean
}

const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],
      setAppointments: (data) => set({ appointments: data }),
      updateStatus: (key, status) =>
        set({
          appointments: get().appointments.map((a) =>
            a.key === key ? { ...a, status } : a
          ),
        }),
      updateStatusAndStock: (key, newStatus) => {
        const appointment = get().appointments.find((a) => a.key === key);
        if (!appointment) return false;

        const prevStatus = appointment.status;
        const vaccines = useVaccineInventoryStore.getState().vaccines;
        const stocks = useVaccineInventoryStore.getState().stocks;
        const vaccineId = getVaccineIdByName(appointment.vaccineType, vaccines);

        // Cek stok sebelum schedule
        if (prevStatus !== "Scheduled" && newStatus === "Scheduled") { // ubah Approved jadi Scheduled
          if (vaccineId) {
            const stock = stocks.find((s) => s.vaccineId === vaccineId)?.quantity ?? 0;
            if (stock <= 0) {
              // Gagal schedule, stok habis
              return false;
            }
            useVaccineInventoryStore.getState().removeStock(vaccineId, 1);
          }
        } else if (prevStatus === "Scheduled" && newStatus !== "Scheduled") { // ubah Approved jadi Scheduled
          if (vaccineId) {
            useVaccineInventoryStore.getState().addStock(vaccineId, 1);
          }
        }

        set({
          appointments: get().appointments.map((a) =>
            a.key === key ? { ...a, status: newStatus } : a
          ),
        });

        return true;
      },
    }),
    { name: "appointments" }
  )
);

function getVaccineIdByName(name: string, vaccines: Vaccine[]): string | undefined {
  return vaccines.find((v) => v.name === name)?.id;
}

export default useAppointmentStore;