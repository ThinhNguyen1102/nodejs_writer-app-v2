const express = require("express");

const appRouter = express();

appRouter.use("/note", require("./note.route"));

appRouter.use("/", (req, res) => {
  res.status(500).json({
    errMessage: "404 not found !!!",
  });
});

module.exports = appRouter;
