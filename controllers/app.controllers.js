const { selectTopics } = require("../models/app.models");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.status(200).send(topics);
  });
};
