import { AxiosError } from "axios";
import { ReplyError } from "ioredis";

export let retryAfterDateTime = new Date().getTime();

export const HttpCode = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * httpCode, description, retryAfter?, toString
 */
export class AppError extends Error {
  httpCode;
  description;
  retryAfter = 0;
  toString = () => {
    let output = "";
    output += "status: " + this.httpCode + "\n";
    output += "description: " + this.description + "\n";
    output += "Wait time in milliseconds: " + this.retryAfter + "\n";
    return output;
  };

  constructor(args) {
    super(args.description);

    this.httpCode = args.httpCode;
    this.description = args.description;
    if (args.retryAfter !== undefined) {
      this.retryAfter = toMilliseconds(args.retryAfter);
      retryAfterDateTime = new Date().getTime() + this.retryAfter;
    }

    Error.captureStackTrace(this);
  }
}

/**
 * Handle all errors
 */
export const handleErrors = (err, req, res, next) => {
  if (err instanceof AxiosError) {
    const errRes = err.response;
    if (errRes !== undefined) {
      const newAppError = new AppError({
        httpCode: errRes.status,
        description: errRes.data.error,
        retryAfter: errRes.headers["retry-after"],
      });
      console.error(newAppError.toString());
      sendErrors(newAppError, req, res, next);
    }
  } else if (err instanceof ReplyError) {
    console.error("Redis error: \n", err);
  } else if (err instanceof Error) console.error(err.message);
  else console.error(err);
};

/**
 * Sends error details to client.
 * Handles error codes 404 and 429.
 */
const sendErrors = (err, req, res, next) => {
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
  return false;
};

/**
 * Takes a date or amunt of seconds and returns the
 *  wait time in milliseconds.
 * @param retryHeader Seconds to wait or a date.
 * @returns number, milliseconds to wait.
 */
function toMilliseconds(retryHeader) {
  const minWaitTime = 3000;
  let waitTime = Math.ceil(parseFloat(retryHeader) * 1000);
  if (isNaN(waitTime)) {
    waitTime = Math.max(
      0,
      new Date(retryHeader).getTime() - new Date().getTime()
    );
  }
  if (waitTime === 0) return 0;
  else if (waitTime < minWaitTime) return minWaitTime;
  else return waitTime + minWaitTime;
}

/**
 * Sends updated wait time to client.
 */
export function sendUpdatedWaitTime(req, res, next) {
  const currDateTime = new Date().getTime();
  const timeDiff = retryAfterDateTime - currDateTime;
  if (timeDiff > 0) {
    const newAppError = new AppError({
      httpCode: HttpCode.TOO_MANY_REQUESTS,
      description: "Retry-After still in effect.",
      retryAfter: Math.ceil(timeDiff / 1000) + "",
    });
    sendErrors(newAppError, req, res, next);
  }
}
