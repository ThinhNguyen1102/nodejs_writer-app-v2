const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const port = 8080;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/api", require("./routes/router"));

app.listen(8080, () => {
  console.log(`Sever is running on port:${port}`);
});
