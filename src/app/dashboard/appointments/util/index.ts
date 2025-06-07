import HttpService from "../../../../constants/HttpService";
import { IApiResult } from "../../../../interfaces/common/IApiResult";

export const allocateAppointment = async (clinicId: string, appointmentId: string) => {
    try {
    // const requestBody = {
    //     vaccineStock: vaccineStock
    // };

    const api: IApiResult<string> = await HttpService.post(`/appointment/allocate?clinicId=${clinicId}&appointmentId=${appointmentId}`);
    return api.data.data;
  } catch (ex) {
    throw ex;
  }
}

export const completeAppointment = async (clinicId: string, appointmentId: string) => {
    try {
    // const requestBody = {
    //     vaccineStock: vaccineStock
    // };

    const api: IApiResult<string> = await HttpService.post(`/appointment/complete?clinicId=${clinicId}&appointmentId=${appointmentId}`);
    return api.data.data;
  } catch (ex) {
    throw ex;
  }
}

export const cancelAppointment = async (clinicId: string, appointmentId: string) => {
    try {
    // const requestBody = {
    //     vaccineStock: vaccineStock
    // };

    const api: IApiResult<string> = await HttpService.post(`/appointment/cancel?clinicId=${clinicId}&appointmentId=${appointmentId}`);
    return api.data.data;
  } catch (ex) {
    throw ex;
  }
}