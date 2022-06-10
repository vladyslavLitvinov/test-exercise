const express = require("express");
const validate = require("./app.service");
const db = require("./db.service");
const app = express();
const port = 3000;

app.get("/adverticements", function (req, res) {
  res.send("hello world");
});

app.get("/adverticements/:id", (req, res) => {
  res.send("Hello World!");
});

app.post("/adverticements", validate, (req, res) => {
  const id = db.createAdvertisement(req.adverticement);
  res.status(201).send(id);
});

app.listen(port, () => {
  console.log(`Application listening on port ${port}`);
});
