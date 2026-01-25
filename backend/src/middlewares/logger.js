const logger = (req, res, next) => {
  const start_time = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start_time;

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} ${duration}ms`,
    );
  });

  next();
};

export default logger;
