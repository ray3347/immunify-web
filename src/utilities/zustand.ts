import { create } from "zustand";
import { IClinicSessionAction, IClinicSessionState } from "../interfaces/zustand";

export const useActiveSession = create<IClinicSessionState & IClinicSessionAction>()
((set)=>({
    activeAccount: null,
    switchAccount: (activeAccount) => set(()=> ({
        activeAccount: activeAccount
    }))
}));