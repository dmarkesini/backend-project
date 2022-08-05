const { removeCommentById } = require("../models/comments.models.js");

exports.deleteCommentById = (req, res, next) => {
  const id = req.params.comment_id;

  removeCommentById(id)
    .then(() => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
