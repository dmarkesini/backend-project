const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticleById,
  patchArticleById,
} = require("./controllers/articles.controllers.js");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703") {
    res.status(400).send({ msg: "Bad request!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error!" });
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found!" });
});

module.exports = app;
