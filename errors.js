exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42703") {
    res.status(400).send({ msg: "Bad request!" });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

exports.handleServerError = (err, req, res, next) => {
  res.status(500).send({ msg: "Server error!" });
};

exports.handleWrongEndpointErrors =
  ("/*",
  (req, res) => {
    res.status(404).send({ msg: "Endpoint not found!" });
  });
