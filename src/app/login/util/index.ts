import MD5 from "crypto-js/md5";
import HttpService from "../../../constants/HttpService";
import { IApiResult } from "../../../interfaces/common/IApiResult";
import { IClinicAccount } from "../../../interfaces/db/IAccount";

export const login = async (username: string, password: string) => {
  try {
    const requestBody = {
      userData: {
        hashedUsername: username,
        hashedPassword: MD5(password).toString(),
      },
    };

    const api: IApiResult<IClinicAccount> = await HttpService.post(
      "/clinic/login",
      requestBody
    );
    return api.data.data;
  } catch (ex) {
    throw ex;
  }
};
