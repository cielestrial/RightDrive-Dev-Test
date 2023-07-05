import axios from "axios";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { Redis } from "ioredis";
import { handleErrors, HttpCode } from "./appErrorSS";

dotenv.config();

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

const redis = new Redis("" + process.env.REDIS_URL);
console.log(redis.status);
console.log(process.env.REDIS_URL);

const apiServer = "https://api.coingecko.com/api/v3";

/**
 * Deletes all keys and data in the Redis cache.
 */
export async function clearCache(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let allKeys: [cursor: string, elements: string[]];
    do {
      allKeys = await redis.scan("0");
      console.log(allKeys);
      if (allKeys[1].length > 0) await redis.del(allKeys[1]);
    } while (allKeys[0] !== "0");

    allKeys = await redis.scan(0);
    console.log(allKeys);

    if (allKeys[1].length === 0) {
      console.warn("cache cleared");
      res.status(HttpCode.OK).json({
        status: HttpCode.OK,
        message: "cache cleared",
      });
    } else {
      console.warn("cache empty");
      res.status(HttpCode.OK).json({
        status: HttpCode.NOT_FOUND,
        message: "cache empty",
      });
    }
  } catch (err) {
    handleErrors(err, req, res, next);
  }
}

/**
 * Sends a list of the top 40 coins with information on each coin.
 * @returns coin[] in a json object.
 */
export async function getCoins(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currency: string = req.body.currency;
  const primaryKey = "COINS";
  let coins: coin[] | undefined;
  let fromCache: boolean;
  const date = new Date();
  const expiryDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  ).getTime();

  try {
    const cachedResult = await redis.get(primaryKey);
    if (cachedResult !== null) {
      coins = JSON.parse(cachedResult);
      console.log("Data retrieved from Redis cache");
      fromCache = true;
    } else {
      const vs_currency = "vs_currency=" + currency;
      const order = "order=" + "market_cap_desc";
      const per_page = "per_page=" + 40;
      const page = "page=" + 1;
      const sparkline = "sparkline=" + false;
      const query = `?${vs_currency}&${order}&${per_page}&${page}&${sparkline}`;

      const result = await axios.get(apiServer + "/coins/markets" + query);
      coins = result.data as coin[];
      console.log("Data retrieved from CoinGecko api");
      fromCache = false;
      await redis.set(primaryKey, JSON.stringify(coins), "PXAT", expiryDate);
    }
    res.status(HttpCode.OK).json({
      status: HttpCode.OK,
      fromCache,
      coins,
    });
  } catch (err) {
    handleErrors(err, req, res, next);
  }
}
