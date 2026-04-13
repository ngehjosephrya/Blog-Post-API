#!/usr/bin/env node

import http from "http";
import app from "../app.js";
import { PORT } from "../config/env.js";

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Blog Post API successfully running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error.syscall !== "listen") throw error;

  switch (error.code) {
    case "EACCES":
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on("close", () => {
  console.log("Server closed");
});