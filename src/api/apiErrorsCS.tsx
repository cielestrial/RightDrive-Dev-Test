import { myAlertsActions } from "../utils/myAlerts";
import { AppDispatch } from "../utils/store";
import { coin } from "./coinApiCS";

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
  description?: string;
  retryAfter?: number;
  fromCache?: boolean;
};

/**
 * Takes time in milliseconds and converts it to days, hours,
 *  minutes, and seconds. Then formats the output.
 * @param waitFor Time in milliseconds.
 * @returns string, formatted output.
 */
export function formatWaitFor(waitFor: number): string {
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
 * @param err the error to display
 * @param dispatch dispatch object, for sending alerts.
 * @param retryTimer MutableRef object, for tracking remaining
 *  retry_after time.
 */
export function handleErrors(
  err: responseType,
  dispatch: AppDispatch,
  retryTimer: React.MutableRefObject<NodeJS.Timeout | undefined>,
  retryAfter: React.MutableRefObject<number>
) {
  if (
    err.status === HttpCode.TOO_MANY_REQUESTS ||
    err.status === HttpCode.PAYMENT_REQUIRED
  ) {
    if (err.retryAfter !== undefined) {
      const waitFor = formatWaitFor(err.retryAfter);
      console.error("Wait for " + waitFor + "\n");
      retryAfter.current = err.retryAfter;
      sendAlert(
        "Too many requests.\nPlease wait for " + waitFor + ".",
        dispatch,
        retryTimer,
        retryAfter
      );
    } else sendAlert("Too many requests.", dispatch, retryTimer);
  }
  console.error(err.description + "\n");
}

/**
 * Changes Snackbar Alert message
 * @param message Message to display
 * @param dispatch dispatch object, for sending alerts.
 * @param retryTimer MutableRef object, for tracking remaining
 *  retry_after time.
 * @param retryAfter time in milliseconds
 */
export function sendAlert(
  message: string,
  dispatch: AppDispatch,
  retryTimer: React.MutableRefObject<NodeJS.Timeout | undefined>,
  retryAfter?: React.MutableRefObject<number>
) {
  dispatch(myAlertsActions.close());
  dispatch(myAlertsActions.setMessage(message));
  dispatch(myAlertsActions.open());
  if (retryAfter !== undefined) startRetryAfterTimer(retryTimer, retryAfter);
}

/**
 *
 * @param dispatch dispatch object, for sending alerts.
 * @param retryTimer MutableRef object, for tracking remaining
 *  retry_after time.
 * @param retryAfter time in milliseconds
 */
export function startRetryAfterTimer(
  retryTimer: React.MutableRefObject<NodeJS.Timeout | undefined>,
  retryAfter: React.MutableRefObject<number>
) {
  clearInterval(retryTimer.current);
  retryTimer.current = setInterval(() => {
    retryAfter.current -= 1000;
    localStorage.setItem("retryAfter", retryAfter.current + "");
    if (retryAfter.current === 0) clearInterval(retryTimer.current);
  }, 1000);
}
