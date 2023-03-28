import { coin } from "./coinApiSS";

/**
 * Holds up execution of code.
 * @param waitTime Time to sleep for, in milliseconds.
 * @returns a void Promise.
 */
export function sleepFor(waitTime: number) {
  return new Promise((resolve) => setTimeout(resolve, waitTime));
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
      market_cap_rank: i,
      symbol: "DC" + i,
      high_24h: 400,
      low_24h: 100,
      current_price: 200,
      market_cap: 2000000,
      total_volume: 1000000,
      ath: 500,
      atl: 50,
      image: undefined,
    };
  }
  return coins;
}
