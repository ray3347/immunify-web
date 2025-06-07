import HttpService from "../../../../constants/HttpService";
import { IApiResult } from "../../../../interfaces/common/IApiResult";
import { IClinicAccount } from "../../../../interfaces/db/IAccount";
import { IVaccineStock } from "../../../../interfaces/db/IClinic";
import { IVaccine } from "../../../../interfaces/db/IVaccine";

export const getVaccineList = async () => {
  try {
    // const requestBody = {
    //   userData: {
    //     hashedUsername: username,
    //     hashedPassword: MD5(password).toString(),
    //   },
    // };

    const api: IApiResult<IVaccine[]> = await HttpService.get("/wiki/vaccine");
    return api.data.data;
  } catch (ex) {
    throw ex;
  }
};

export const modifyVaccineStock = async (
  accountId: string,
  vaccineStock: IVaccineStock
) => {
  try {
    const requestBody = {
      vaccineStock: vaccineStock,
    };

    const api: IApiResult<string> = await HttpService.post(
      `/clinic/vaccine-stock/modify?accountId=${accountId}`,
      requestBody
    );
    return api.data.data;
  } catch (ex) {
    throw ex;
  }
};
