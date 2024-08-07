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

const apiServer = "https://api.coingecko.com/api/v3";
let redis: Redis | null = null;

/**
 * Creates a redis instance/connection.
 * @returns Redis instance on success, null on failure.
 */
async function createRedis() {
  try {
    const redis = new Redis(process.env.REDIS_URL ?? "");
    const ping = await redis.ping();
    console.info("Redis Connection Established:", ping);
    return redis;
  } catch (error) {
    console.error("Error connecting to Redis server");
    return null;
  }
}

/**
 * Deletes all keys and data in the Redis cache.
 */
export async function clearCache(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!redis) redis = await createRedis();
    if (!redis) throw new Error("Redis not connected");

    let allKeys = await redis.scan(0);
    let coinKeys = allKeys[1].filter((key) => key.includes("COIN"));
    console.log(coinKeys);

    while (coinKeys.length > 0) {
      await redis.del(coinKeys);
      console.log(coinKeys);
      allKeys = await redis.scan(0);
      coinKeys = allKeys[1].filter((key) => key.includes("COIN"));
    }

    console.log(coinKeys);
    console.warn("cache cleared");
    const status = HttpCode.OK;
    res.status(status).json({ status, message: "cache cleared" });
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
    if (!redis) redis = await createRedis();
    const cachedResult = !redis ? null : await redis.get(primaryKey);

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

      if (redis)
        await redis.set(primaryKey, JSON.stringify(coins), "PXAT", expiryDate);
    }
    const status = HttpCode.OK;
    res.status(status).json({ status, fromCache, coins });
  } catch (err) {
    handleErrors(err, req, res, next);
  }
}
