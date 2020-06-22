const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const cors = require("cors");

const PORT = 5000;

app.use(cors());

app.use(express.static(path.join(__dirname, "my-app", "build")));
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "PRODUCTION") {
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "my-app", "build", "index.html"));
  });
}

app.listen(PORT);
