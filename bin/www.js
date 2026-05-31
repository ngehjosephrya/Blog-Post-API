#!/usr/bin/env node

import http from "http";
import app from "../app.js";
import { PORT } from "../config/env.js";

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(` Server started successfully on port ${PORT}`);
  console.log(` Listening at http://localhost:${PORT}`);
  console.log(` Started at: ${new Date().toLocaleTimeString()}`);
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
      console.error(`Try killing the process: lsof -i :${PORT} && kill -9 <PID>`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on("close", () => {
  console.log("Server closed");
});