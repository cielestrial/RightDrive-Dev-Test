import axios from "axios";

const server = "https://api.coinpaprika.com/v1/";

export type coin = {
  id: string;
  name: string;
  rank: number;
  symbol: string;
  logo?: string;
  priceDetails?: priceDetails;
};

/** In USD */
export type priceDetails = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  currency: "USD";
};

export const getCoins = async () => {
  try {
    axios.defaults.headers.common = {};
    const res = await axios.get(server + "coins");
    return res.data.slice(0, 40) as coin[];
  } catch (err) {
    console.error("Something went wrong with getCoins()\n", err);
    return undefined;
  }
};

export const getLogo = async (coin_id: string) => {
  try {
    const res = await axios.get(server + "coins/" + coin_id + "/twitter");
    return res.data["logo"] as string;
  } catch (err) {
    console.error(
      "Something went wrong with getLogo() for " + coin_id + "\n",
      err
    );
    return undefined;
  }
};

export const getPriceDetails = async (coin_id: string) => {
  try {
    const res = await axios.get(server + "coins/" + coin_id + "/ohlcv/latest/");
    return res.data as priceDetails;
  } catch (err) {
    console.error(
      "Something went wrong with getPrice() for " + coin_id + "\n",
      err
    );
    return undefined;
  }
};
