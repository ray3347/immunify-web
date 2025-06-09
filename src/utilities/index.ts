import HttpService from "../constants/HttpService";
import { IApiResult } from "../interfaces/common/IApiResult";
import { IClinicAccount } from "../interfaces/db/IAccount";

export const getClinicById = async (accountId: string) => {
try {
    const api: IApiResult<IClinicAccount> = await HttpService.get(`/clinic/id?accountId=${accountId}`);
    return api.data.data;
  } catch (ex) {
    throw ex;
  }
}