import axios from "axios";
import { handleErrors, HttpCode, responseType } from "./apiErrors";

const server = "http://localhost:8080/";

export type coin = {
  id: string;
  name: string;
  rank: number;
  symbol: string;
  logo?: string;
  priceDetails?: priceDetails;
};

export type priceDetails = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  currency: "USD";
};

export async function getCoins() {
  try {
    const res = await axios.get(server + "coins");
    const data = res.data as responseType;
    if (data.status === HttpCode.OK) return data.coins;
    else handleErrors(data);
  } catch (err) {
    console.error("Something went wrong with getCoins()\n", err);
  }
  return undefined;
}

export async function getLogo(coin_id: string) {
  try {
    const res = await axios.post(server + "logo", { coin_id });
    const data = res.data as responseType;
    if (data.status === HttpCode.OK) return data.logo;
    else handleErrors(data, coin_id);
  } catch (err) {
    console.error(
      "Something went wrong with getLogo() for " + coin_id + "\n",
      err
    );
  }
  return undefined;
}

export async function getPriceDetails(coin_id: string) {
  try {
    const res = await axios.post(server + "price", { coin_id });
    const data = res.data as responseType;
    if (data.status === HttpCode.OK) return data.priceDetails;
    else handleErrors(data, coin_id);
  } catch (err) {
    console.error(
      "Something went wrong with getPrice() for " + coin_id + "\n",
      err
    );
  }
  return undefined;
}
