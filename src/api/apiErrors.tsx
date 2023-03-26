import { coin, priceDetails } from "./coinApi";

export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

export type responseType = {
  status: HttpCode;
  coins?: coin[];
  logo?: string;
  priceDetails?: priceDetails;
  description?: string;
  retryAfter?: number;
};

/**
 *
 * @param waitFor Time in milliseconds.
 * @returns
 */
function formatWaitFor(waitFor: number): string {
  let formattedOutput = "";
  let seconds = Math.ceil(waitFor / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;

  if (days > 0) formattedOutput += days + (days > 1 ? " days" : " day");
  else if (hours > 0) {
    formattedOutput += hours + (hours > 1 ? " hours" : " hour");
    if (minutes > 0) {
      formattedOutput += " and ";
      formattedOutput += minutes + (minutes > 1 ? " minutes" : " minute");
    }
  } else if (minutes > 0) {
    formattedOutput += minutes + (minutes > 1 ? " minutes" : " minute");
    if (seconds > 0) {
      formattedOutput += " and ";
      formattedOutput += seconds + (seconds > 1 ? " seconds" : " second");
    }
  } else formattedOutput += seconds + (seconds > 1 ? " seconds" : " second");
  return formattedOutput;
}

/**
 * Alert and print error details
 * @param err
 * @param coin_id
 */
export function handleErrors(err: responseType, coin_id?: string) {
  if (err.status === HttpCode.NOT_FOUND) {
    if (coin_id !== undefined)
      alert("Failed to retrieve data for " + coin_id + ".\n");
  } else if (
    err.status === HttpCode.TOO_MANY_REQUESTS ||
    err.status === HttpCode.PAYMENT_REQUIRED
  ) {
    if (err.retryAfter !== undefined) {
      const waitFor = formatWaitFor(err.retryAfter);
      alert("Too many requests.\nPlease wait for " + waitFor + ".\n");
    } else alert("Too many requests.\n");
  }
  console.error(err.description + "\n");
}
