import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const error_handler = (err, req, res, next) => {
  const log_file_path = path.join(__dirname, "../../logs/error.log");

  const status_code = err.status_code || 500;

  const error_response = {
    error: err.message || "Internal Server Error",
  };

  if (err.details) {
    error_response.details = err.details;
  }

  const log_message = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${status_code} | ${err.message} | ${err.stack}\n`;

  const log_dir = path.dirname(log_file_path);
  if (!fs.existsSync(log_dir)) {
    fs.mkdirSync(log_dir, { recursive: true });
  }

  fs.appendFile(log_file_path, log_message, (fs_err) => {
    if (fs_err) {
      console.error("Failed to write error log:", fs_err);
    }
  });

  if (!res.headersSent) {
    res.status(status_code).json(error_response);
  }
};

export default error_handler;
