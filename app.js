const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const cors = require("cors");
const axios = require("axios");
const fetchUrl = require("fetch").fetchUrl;
let func = require("./scrapeTest");

const PORT = 5000;

app.use(cors());

app.use(express.static(path.join(__dirname, "my-app", "build")));
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "PRODUCTION") {
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "my-app", "build", "index.html"));
  });
}
//console.log(func.func);

//setInterval(() => func.func, 60 * 60 * 1000);
// fs.writeFileSync("./my-app/src/test.txt", "hello");
app.listen(PORT);
