const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return rows[0];
    });
};