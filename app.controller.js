const express = require("express");
const validate = require("./app.service");
const app = express();

app.use(express.json());

app.get("/adverticements", async (req, res) => {
  const page = req.body?.page || 0;
  const sort = req.body?.sort;
  try {
    result = await app.dbService.find(page, sort);
    res.send(result);
  }
  catch (e) {
    res.status(500).send(`Error with finding! ${e.message}`);
  }
});

app.get("/adverticements/:id", async (req, res) => {
  const key = `${req.params.id}${req.body.fields}`;
  try {
    let result = JSON.parse(await app.redis.get(key));
    if (!result) {
      result = await app.dbService.findOne(req.params.id, req.body.fields);
      app.redis.set(key, JSON.stringify(result));
    }
    res.send(result);
  }
  catch (e) {
    res.status(404).send(`Adverticement not found! ${e.message}`);
  }
});

app.post("/adverticements", validate, async (req, res) => {
  try {
    const id = await app.dbService.createAdvertisement(req.adverticement);
    res.status(201).send(id);
  }
  catch (e) {
    res.status(400).send(`Error with saving to database! ${e.message}`);
  }
});

module.exports = app;