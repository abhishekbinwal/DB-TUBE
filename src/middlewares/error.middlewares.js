// import mongoose from "mongoose";

// import { ApiError } from "../utils/ApiError.js";

// const errorHandler = (err, req, res, next) => {
//   let error = err;
//   let statusCode;

//   if (!(error instanceof ApiError)) {
//     statusCode =
//       error.statusCode || error instanceof mongoose.Error ? 400 : 500;
//   }

//   const message = error.message || "Something went wrong ";
//   error = new ApiError(statusCode, message, error?.errors || [], err.stack);

//   //
//   const response = {
//     ...error,
//     message: error.message,
//     ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
//   };
// };

// export { errorHandler };

////////////////////////////////////////////////
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;
  let statusCode;

  if (!(error instanceof ApiError)) {
    statusCode = error.statusCode
      ? error.statusCode
      : error instanceof mongoose.Error
        ? 400
        : 500;

    const message = error.message || "Something went wrong ";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  } else {
    statusCode = error.statusCode;
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  res.status(statusCode).json(response);
};

export { errorHandler };
