import { IClinicAccount } from "../db/IAccount";

export interface IClinicSessionState{
    activeAccount: IClinicAccount | null;
}

export interface IClinicSessionAction{
    switchAccount: (account: IClinicSessionState['activeAccount']) => void;
}