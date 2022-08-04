const { removeCommentById } = require("../models/comments.models.js");

exports.deleteCommentById = (req, res, next) => {
  const id = req.params.comment_id;

  removeCommentById(id)
    .then(() => {
      console.log(123);
      res.status(204).send({ msg: "No content!" });
    })
    .catch((err) => {
      next(err);
    });
};
