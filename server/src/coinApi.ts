import axios from "axios";
import { NextFunction, Request, Response } from "express";
import {
  handleErrors,
  retryAfterDateTime,
  sendUpdatedWaitTime,
} from "./appError";

const server = "https://api.coinpaprika.com/v1/";

type coin = {
  id: string;
  name: string;
  rank: number;
  symbol: string;
  logo: string;
  priceDetails: priceDetails;
};

type priceDetails = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  currency: "USD";
};

/**
 *
 * @returns True, if not waiting for Retry-After. False, otherwise
 */
function canRequest(): boolean {
  const currDateTime = new Date().getTime();
  const timeDiff = retryAfterDateTime - currDateTime;
  if (timeDiff > 0) return false;
  else return true;
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function getCoins(req: Request, res: Response, next: NextFunction) {
  if (canRequest()) {
    axios
      .get(server + "coins")
      .then((result) => {
        res.status(result.status).json({
          status: result.status,
          coins: result.data.slice(0, 40) as coin[],
        });
      })
      .catch((err) => {
        handleErrors(err, req, res, next);
      });
  } else sendUpdatedWaitTime(req, res, next);
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function getLogo(req: Request, res: Response, next: NextFunction) {
  const coin_id: string = req.body.coin_id;
  if (canRequest()) {
    axios
      .get(server + "coins/" + coin_id + "/twitter")
      .then((result) => {
        res.status(result.status).json({
          status: result.status,
          logo: result.data["logo"],
        });
      })
      .catch((err) => {
        handleErrors(err, req, res, next);
      });
  } else sendUpdatedWaitTime(req, res, next);
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function getPriceDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const coin_id: string = req.body.coin_id;
  if (canRequest()) {
    axios
      .get(server + "coins/" + coin_id + "/ohlcv/latest/")
      .then((result) => {
        res.status(result.status).json({
          status: result.status,
          priceDetails: result.data as priceDetails,
        });
      })
      .catch((err) => {
        handleErrors(err, req, res, next);
      });
  } else sendUpdatedWaitTime(req, res, next);
}
