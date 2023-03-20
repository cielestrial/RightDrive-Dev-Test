import { AxiosError } from "axios";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export let retryAfterDateTime: number = new Date().getTime();

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

type errorMessage = {
  error: string;
};

interface AppErrorArgs {
  httpCode: HttpCode;
  description: string;
  retryAfter?: string;
}

/**
 * httpCode, description, retryAfter?
 */
export class AppError extends Error {
  public readonly httpCode: HttpCode;
  public readonly description: string;
  public readonly retryAfter: number = 0;

  constructor(args: AppErrorArgs) {
    super(args.description);

    this.httpCode = args.httpCode;
    this.description = args.description;
    if (args.retryAfter !== undefined) {
      this.retryAfter = getMillisToSleep(args.retryAfter);
      retryAfterDateTime = new Date().getTime() + this.retryAfter;
    }

    Error.captureStackTrace(this);
    console.error("status: ", this.httpCode);
    console.error("description: ", this.description);
    console.error("Wait time in milliseconds: ", this.retryAfter);
  }
}

/**
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
export const handleErrors: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AxiosError) {
    const errRes = err.response;
    if (errRes !== undefined) {
      const newAppError = new AppError({
        httpCode: errRes.status,
        description: (errRes.data as errorMessage).error,
        retryAfter: errRes.headers["retry-after"],
      });
      errorHandler(newAppError, req, res, next);
    }
  }
};

/**
 * Handle error codes 404 and 429
 * @param err
 * @param req
 * @param res
 * @param next
 */
const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    if (err.httpCode === HttpCode.NOT_FOUND) {
      res
        .status(HttpCode.OK)
        .json({ status: err.httpCode, description: err.description });
    } else if (
      err.httpCode === HttpCode.PAYMENT_REQUIRED ||
      err.httpCode === HttpCode.TOO_MANY_REQUESTS
    ) {
      if (err.retryAfter > 0) {
        res.status(HttpCode.OK).json({
          status: err.httpCode,
          description: err.description,
          retryAfter: err.retryAfter,
        });
      } else {
        res
          .status(HttpCode.OK)
          .json({ status: err.httpCode, description: err.description });
      }
    }
  }
  return false;
};

function getMillisToSleep(retryHeader: string): number {
  const minWaitTime = 3000;
  let millisToSleep = Math.ceil(parseFloat(retryHeader) * 1000);
  if (isNaN(millisToSleep)) {
    millisToSleep = Math.max(
      0,
      new Date(retryHeader).getTime() - new Date().getTime()
    );
  }
  if (millisToSleep === 0) return 0;
  else if (millisToSleep < minWaitTime) return minWaitTime;
  else return millisToSleep + minWaitTime;
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function sendUpdatedWaitTime(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const currDateTime = new Date().getTime();
  const timeDiff = retryAfterDateTime - currDateTime;
  if (timeDiff > 0) {
    const newAppError = new AppError({
      httpCode: HttpCode.TOO_MANY_REQUESTS,
      description: "Retry-After still in effect.",
      retryAfter: Math.ceil(timeDiff / 1000) + "",
    });
    errorHandler(newAppError, req, res, next);
  }
}
