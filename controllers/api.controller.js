const routes = require("../endpoints.json");

exports.getRoutes = (req, res, next) => {
  res.status(200).send(routes);
};
