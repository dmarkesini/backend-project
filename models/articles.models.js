const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) :: INT AS comment_count FROM articles LEFT JOIN 
comments ON articles.article_id = comments.article_id WHERE articles.article_id = ${id} GROUP BY articles.article_id;`
    )
    .then(({ rows }) => {
      if (rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return rows[0];
    });
};

exports.updateArticleById = (inc_votes, id) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, missing information!",
    });
  } else if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Bad request, incorrect input!",
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = ${inc_votes} + votes WHERE article_id = ${id} RETURNING *`
    )
    .then(({ rows }) => {
      if (rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return rows[0];
    });
};

exports.insertComment = (id, body) => {
  if (body.body === undefined || body.username === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, missing information!",
    });
  } else if (
    typeof body.body === "number" ||
    typeof body.username === "number"
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request, incorrect input!",
    });
  }

  return db
    .query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then(({ rows }) => {
      if (rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      } else {
        return db
          .query(
            `INSERT INTO comments (article_id, author, body)
             VALUES (${id},'${body.username}', '${body.body}')
             RETURNING *`
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
};

exports.selectCommentsById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = ${id}`)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      } else {
        return db
          .query(
            `SELECT comment_id, votes, created_at, author, body FROM comments
             WHERE article_id = ${id}`
          )
          .then(({ rows }) => {
            return rows;
          });
      }
    });
};

exports.selectArticles = ({
  sort_by = "created_at",
  order = "DESC",
  topic,
}) => {
  const validSortQuery = ["votes", "created_at"];
  const validOrderQuery = ["ASC", "DESC"];
  const baseQuery = `SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes,
         COUNT(comments.article_id) :: INT AS comment_count
         FROM articles LEFT JOIN comments 
         ON articles.article_id = comments.article_id
         GROUP BY articles.article_id
         ORDER BY articles.${sort_by} ${order};`;

  const queryWithTopic = `${baseQuery.slice(
    0,
    baseQuery.indexOf("GROUP")
  )} WHERE articles.topic = '${topic}' ${baseQuery.slice(
    baseQuery.indexOf("GROUP")
  )}`;

  if (!validSortQuery.includes(sort_by) || !validOrderQuery.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query!" });
  }
  if (topic) {
    return db
      .query(`SELECT * FROM topics WHERE slug = '${topic}'`)
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Topic not found!" });
        } else {
          return db
            .query(`SELECT * FROM articles WHERE topic = '${topic}'`)
            .then(({ rows }) => {
              if (rows.length === 0) {
                return Promise.reject({
                  status: 404,
                  msg: "Article not found!",
                });
              } else {
                return db.query(queryWithTopic).then(({ rows }) => {
                  return rows;
                });
              }
            });
        }
      });
  } else {
    return db.query(baseQuery).then(({ rows }) => {
      return rows;
    });
  }
};
