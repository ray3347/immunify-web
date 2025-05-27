import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Vaccine, VaccineStock } from "@/type";

interface VaccineInventoryState {
  vaccines: Vaccine[];
  stocks: VaccineStock[];
  setVaccines: (vaccines: Vaccine[]) => void;
  setStocks: (stocks: VaccineStock[]) => void;
  addStock: (vaccineId: string, qty: number) => void;
  removeStock: (vaccineId: string, qty: number) => void;
  deleteStock: (vaccineId: string) => void;
}

const useVaccineInventoryStore = create<VaccineInventoryState>()(
  persist(
    (set, get) => ({
      vaccines: [],
      stocks: [],
      setVaccines: (vaccines) => set({ vaccines }),
      setStocks: (stocks) => set({ stocks }),
      addStock: (vaccineId, qty) =>
        set((state) => ({
          stocks: state.stocks.map((stock) =>
            stock.vaccineId === vaccineId
              ? { ...stock, quantity: stock.quantity + qty }
              : stock
          ),
        })),
      removeStock: (vaccineId, qty) =>
        set((state) => ({
          stocks: state.stocks.map((stock) =>
            stock.vaccineId === vaccineId
              ? { ...stock, quantity: Math.max(0, stock.quantity - qty) }
              : stock
          ),
        })),
      deleteStock: (vaccineId) =>
        set((state) => ({
          stocks: state.stocks.map((stock) =>
            stock.vaccineId === vaccineId
              ? { ...stock, quantity: 0 }
              : stock
          ),
        })),
    }),
    { name: "vaccine-inventory" }
  )
);

export default useVaccineInventoryStore;