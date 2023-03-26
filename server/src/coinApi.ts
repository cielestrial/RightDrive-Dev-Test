import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { Redis } from "ioredis";
import {
  handleErrors,
  HttpCode,
  retryAfterDateTime,
  sendUpdatedWaitTime,
} from "./appError";
import {
  getDummyCoins,
  getDummyLogo,
  getDummyPriceDetails,
  sleepFor,
} from "./dummyData";

dotenv.config();
const server = "https://api.coinpaprika.com/v1/";

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
  currency?: "USD";
};

const redis = new Redis({
  port: 14019,
  host: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});
/**
 * Clears redis cache
 */
/*
(async () => {
  const key = "COINS";
  await redis.del(key);
  console.log("deleted");
})();
*/

/**
 * Checks date to see if the cached priceDetails data is stale.
 */
async function newDay() {
  const dateKey = "TOMORROW";
  const tomorrow = await redis.get(dateKey);
  if (tomorrow === null) return true;
  const today = new Date().getTime();
  const timeDiff = +tomorrow - today;
  if (timeDiff > 0) return false;
  else return true;
}

/**
 * Checks if application is waiting for Coinpaprika's Retry-After period to end.
 * @returns True, if not waiting for Retry-After. False, otherwise
 */
function canRequest(): boolean {
  const currDateTime = new Date().getTime();
  const timeDiff = retryAfterDateTime - currDateTime;

  if (timeDiff > 0) return false;
  else return true;
}

/**
 * Sends information on the top 40 coins to the client.
 * @returns coin[] as json object.
 */
export async function getCoins(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const primaryKey = "COINS";
  let coins: coin[] | undefined;
  const date = new Date();
  const expiryDate = new Date(
    date.getFullYear(),
    date.getMonth() + 1
  ).getTime();

  try {
    const cachedResult = await redis.get(primaryKey);
    if (cachedResult !== null) {
      coins = JSON.parse(cachedResult);
      console.log("Data retrieved from Redis cache");
    } else if (canRequest()) {
      /*
      const result = await axios.get(server + "coins");
      coins = result.data.slice(0, 40) as coin[];
      */
      await sleepFor(1000);
      coins = getDummyCoins().slice(0, 40) as coin[];
      console.log("Data retrieved from Coinpaprika api");
      await redis.set(primaryKey, JSON.stringify(coins), "PXAT", expiryDate);
    } else sendUpdatedWaitTime(req, res, next);

    res.status(HttpCode.OK).json({
      status: HttpCode.OK,
      coins,
    });
  } catch (err) {
    handleErrors(err, req, res, next);
  }
}

/**
 * Sends the logo url for a given coin_id to the client.
 * @param req coin_id.
 * @returns logo as json object.
 */
export async function getLogo(req: Request, res: Response, next: NextFunction) {
  const coin_id: string = req.body.coin_id;
  const key = "COINS";
  let coins: coin[];
  let logo: string | undefined;

  try {
    const cachedResult = await redis.get(key);
    if (cachedResult !== null) {
      coins = JSON.parse(cachedResult);
      const index = coins.findIndex((coin) => coin.id === coin_id);
      if (index < 0) throw new Error("Could not find index of coin_id");
      if (coins[index].logo !== undefined) {
        logo = coins[index].logo;
      } else if (canRequest()) {
        /*
        const result = await axios.get(
          server + "coins/" + coin_id + "/twitter"
        );
        logo = result.data["logo"];
        */
        await sleepFor(200);
        logo = getDummyLogo();
        coins[index].logo = logo;
        await redis.set(key, JSON.stringify(coins), "KEEPTTL");
      } else sendUpdatedWaitTime(req, res, next);

      res.status(HttpCode.OK).json({
        status: HttpCode.OK,
        logo,
      });
    } else throw new Error("Could not access cache");
  } catch (err) {
    handleErrors(err, req, res, next);
  }
}

/**
 * Sends the priceDetails for a given coin_id to the client.
 * @param req coin_id.
 * @returns priceDetails as json object.
 */
export async function getPriceDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const coin_id: string = req.body.coin_id;
  const key = "COINS";
  const dateKey = "TOMORROW";
  let coins: coin[];
  let priceDetails: priceDetails | undefined;
  const date = new Date();
  const expiryDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  ).getTime();

  try {
    const cachedResult = await redis.get(key);
    if (cachedResult !== null) {
      coins = JSON.parse(cachedResult);
      const index = coins.findIndex((coin) => coin.id === coin_id);
      if (index < 0) throw new Error("Could not find index of coin_id");
      const isNewDay = await newDay();
      if (coins[index].priceDetails !== undefined && !isNewDay) {
        priceDetails = coins[index].priceDetails;
      } else if (canRequest()) {
        if (isNewDay) await redis.set(dateKey, expiryDate, "PXAT", expiryDate);
        /*
        const result = await axios.get(
          server + "coins/" + coin_id + "/ohlcv/latest"
        );
        priceDetails = result.data as priceDetails;
        */
        await sleepFor(300);
        priceDetails = getDummyPriceDetails() as priceDetails;
        priceDetails.currency = "USD";
        coins[index].priceDetails = priceDetails;
        await redis.set(key, JSON.stringify(coins), "KEEPTTL");
      } else sendUpdatedWaitTime(req, res, next);

      res.status(HttpCode.OK).json({
        status: HttpCode.OK,
        priceDetails,
      });
    } else throw new Error("Could not access cache");
  } catch (err) {
    handleErrors(err, req, res, next);
  }
}
