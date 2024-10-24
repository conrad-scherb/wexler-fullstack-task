import express from "express";

const api = express();

api.get("/", function (req, res) {
  res.send(`Image Management System (Backend)`);
});

export default api;
