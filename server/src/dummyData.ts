import { coin, priceDetails } from "./coinApi";

/**
 * Holds up execution of code.
 * @param waitTime Time to sleep for, in milliseconds.
 * @returns a void Promise.
 */
export function sleepFor(waitTime: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, waitTime));
}

/**
 * Creates dummy coin data.
 * @returns coin[].
 */
export function getDummyCoins(): coin[] {
  const coins: coin[] = [];
  for (let i = 1; i <= 40; i++) {
    coins[i - 1] = {
      id: "dummyCoin" + i,
      name: "Dummy Coin " + i,
      rank: i,
      symbol: "DC" + i,
    };
  }
  return coins;
}

/**
 * Creates dummy priceDetails data.
 * @returns priceDetails object.
 */
export function getDummyPriceDetails(): priceDetails {
  return {
    open: 200,
    high: 400,
    low: 100,
    close: 300,
    volume: 1000000,
  };
}

/**
 * Creates dummy logo data.
 * @returns url string.
 */
export function getDummyLogo(): string {
  return "https://static.coinpaprika.com/coin/bnb-binance-coin/logo.png";
}
