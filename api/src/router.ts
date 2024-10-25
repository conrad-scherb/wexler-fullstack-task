import express from "express";
import { setupTypeORM } from "./data-source";

void setupTypeORM();

const api = express();

api.get("/", function (req, res) {
  res.send(`Image Management System (Backend)`);
});

export default api;
