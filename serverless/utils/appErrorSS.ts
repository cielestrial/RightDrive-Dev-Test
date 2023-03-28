import { AxiosError } from "axios";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ReplyError } from "ioredis";

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
 * httpCode, description, retryAfter?, toString
 */
export class AppError extends Error {
  public readonly httpCode: HttpCode;
  public readonly description: string;
  public readonly retryAfter: number = 0;
  public toString = () => {
    let output = "";
    output += "status: " + this.httpCode + "\n";
    output += "description: " + this.description + "\n";
    output += "Wait time in milliseconds: " + this.retryAfter + "\n";
    return output;
  };

  constructor(args: AppErrorArgs) {
    super(args.description);

    this.httpCode = args.httpCode;
    this.description = args.description;
    if (args.retryAfter !== undefined) {
      this.retryAfter = toMilliseconds(args.retryAfter);
    }

    Error.captureStackTrace(this);
  }
}

/**
 * Handle all errors
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
      console.error(newAppError.toString());
      res.status(HttpCode.OK).json(sendErrors(newAppError));
    }
  } else if (err instanceof ReplyError) {
    console.error("Redis error: \n", err);
  } else if (err instanceof Error) console.error(err.message);
  else console.error(err);
};

/**
 * Creates the error object that will be sent to the client
 * @param err the error
 * @returns error object to be sent to client
 */
const sendErrors = (err: any) => {
  if (err.retryAfter > 0) {
    return {
      status: err.httpCode,
      description: err.description,
      retryAfter: err.retryAfter,
    };
  } else return { status: err.httpCode, description: err.description };
};

/**
 * Takes a date or amunt of seconds and returns the
 *  wait time in milliseconds.
 * @param retryHeader Seconds to wait or a date.
 * @returns number, milliseconds to wait.
 */
function toMilliseconds(retryHeader: string) {
  let waitTime = Math.ceil(parseFloat(retryHeader) * 1000);
  if (isNaN(waitTime)) {
    waitTime = Math.max(
      0,
      new Date(retryHeader).getTime() - new Date().getTime()
    );
  }
  return waitTime;
}
