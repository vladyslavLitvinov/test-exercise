const express = require("express");
const validate = require("./app.service");
const dbService = require("./db.service.js");
const app = express();
const port = 3000;

app.use(express.json())

app.get("/adverticements", async (req, res) => {
  const page = req.body?.page || 0;
  const sort = req.body?.sort;
  const result = await dbService.find(page, sort);
  res.send(result);
});

app.get("/adverticements/:id", async (req, res) => {
  if (!req.params.id) res.status(400).send("Should be id!");
  try {
    const result = await dbService.findOne(req.params.id, req.body?.fields);
    res.send(result);
  }
  catch (e) {
    res.status(404).send("Adverticement not found!" + e.message);
  }
});

app.post("/adverticements", validate, async (req, res) => {
  try {
    const id = await dbService.createAdvertisement(req.adverticement);
    res.status(201).send(id);
  }
  catch (e) {
    res.status(500).send("Error with saving to database!" + e.message);
  }
});

app.listen(port, async () => {
  await dbService.connect();
  console.log(`Application listening on port ${port}`);
});
