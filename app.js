const express = require("express");
const app = express();
const { getTopics } = require("./controllers/app.controllers");

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found!" });
});

module.exports = app;
