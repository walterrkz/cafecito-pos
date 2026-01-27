import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setup_global_error_handlers = () => {
  const log_file_path = path.join(__dirname, "../../logs/error.log");

  const log_dir = path.dirname(log_file_path);
  if (!fs.existsSync(log_dir)) {
    fs.mkdirSync(log_dir, { recursive: true });
  }

  process.on("uncaughtException", (error) => {
    const date_time = new Date();
    const log_message = `${date_time.toISOString()} | UNCAUGHT_EXCEPTION | ${error.message} | ${error.stack}\n`;

    fs.appendFileSync(log_file_path, log_message);
    console.log("Uncaught exception logged. Server continues running.");
  });

  process.on("unhandledRejection", (reason, promise) => {
    const date_time = new Date();
    const log_message = `${date_time.toISOString()} | UNHANDLED_REJECTION | ${reason} | ${promise}\n`;

    fs.appendFileSync(log_file_path, log_message);
    console.log("Unhandled rejection logged. Server continues running.");
  });
};

export default setup_global_error_handlers;
