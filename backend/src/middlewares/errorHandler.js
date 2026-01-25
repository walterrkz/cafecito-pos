import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errorHandler = (err, req, res, next) => {
  const logFilePath = path.join(__dirname, "../../logs/error.log");

  const statusCode = err.statusCode || 500;

  const errorResponse = {
    error: err.message || "Internal Server Error",
  };

  if (err.details) {
    errorResponse.details = err.details;
  }

  const logMessage = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${statusCode} | ${err.message} | ${err.stack}\n`;

  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  fs.appendFile(logFilePath, logMessage, (fsErr) => {
    if (fsErr) {
      console.error("Failed to write error log:", fsErr);
    }
  });

  if (!res.headersSent) {
    res.status(statusCode).json(errorResponse);
  }
};

export default errorHandler;
