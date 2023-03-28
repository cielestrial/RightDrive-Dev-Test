import axios from "axios";
import { AppDispatch } from "../utils/store";
import {
  formatWaitFor,
  handleErrors,
  HttpCode,
  responseType,
  sendAlert,
} from "./apiErrorsCS";

const base = import.meta.env.DEV
  ? "http://localhost:8888"
  : "https://rightdrive-dev-test.netlify.app";
const netlifyFunctions = "/.netlify/functions/api";
const server = base + netlifyFunctions;

export type coin = {
  id: string;
  symbol: string;
  name: string;
  image: string | undefined;
  market_cap_rank: number;
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  atl: number;
};

/**
 * Retrieves a list of the top 40 coins with information on each coin.
 * @param currency the currency the values should be in.
 *  (Ex. cad, usd, etc.)
 * @param dispatch dispatch object, for sending alerts.
 * @param retryTimer MutableRef object, for tracking remaining
 *  retry_after time.
 * @returns coin[], on success. undefined, on failure.
 */
export async function getCoins(
  currency: string,
  dispatch: AppDispatch,
  retryTimer: React.MutableRefObject<NodeJS.Timer | undefined>,
  retryAfter: React.MutableRefObject<number>,
  fromCache: React.MutableRefObject<boolean>
) {
  try {
    const res = await axios.post(server + "/coins", { currency });
    const data = res.data as responseType;
    if (data.status === HttpCode.OK) {
      if (data.fromCache !== undefined) fromCache.current = data.fromCache;
      return data.coins;
    } else handleErrors(data, dispatch, retryTimer, retryAfter);
  } catch (err) {
    console.error("Something went wrong with getCoins()\n", err);
  }
  return undefined;
}

/**
 * Retrieves the Retry After time from local storage.
 * @param dispatch dispatch object, for sending alerts.
 * @param retryTimer MutableRef object, for tracking remaining
 *  retry_after time.
 */
export function getRetryAfter(
  dispatch: AppDispatch,
  retryTimer: React.MutableRefObject<NodeJS.Timer | undefined>,
  retryAfter: React.MutableRefObject<number>
) {
  const retryAfterString = localStorage.getItem("retryAfter");
  if (retryAfterString !== null) {
    retryAfter.current = Number(retryAfterString);
    if (retryAfter.current > 0) {
      const waitFor = formatWaitFor(retryAfter.current);
      sendAlert(
        "Retry After timer remaining from previous session." +
          "\nPlease wait for " +
          waitFor +
          ".",
        dispatch,
        retryTimer,
        retryAfter
      );
    }
  } else localStorage.setItem("retryAfter", "0");
}
