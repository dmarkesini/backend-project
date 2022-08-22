const cors = require("cors");
const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticleById,
  patchArticleById,
  postComment,
  getCommentsById,
  getArticles,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const { deleteCommentById } = require("./controllers/comments.controllers.js");
const { getRoutes } = require("./controllers/api.controller.js");
const {
  handleCustomErrors,
  handlePSQLErrors,
  handleServerError,
  handleWrongEndpointErrors,
} = require("./errors.js");

app.use(cors());

app.use(express.json());

app.get("/api", getRoutes);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleServerError);

app.use(handleWrongEndpointErrors);

module.exports = app;
