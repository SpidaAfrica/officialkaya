import { AxiosError } from "axios";

export function cleanErr(error: Error) {
  if (error instanceof AxiosError) {
    if (error.response?.data) {
      const errStr = error.response.data.message;
      return errStr;
    }
  }
}
