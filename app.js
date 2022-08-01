const express = require("express");
const app = express();
const { getTopics, getArticleById } = require("./controllers/app.controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found!" });
});

module.exports = app;
