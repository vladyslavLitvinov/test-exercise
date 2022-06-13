const app = require("./app.controller");
const dbService = require("./db.service.js");
require("dotenv").config({ path: "./config/.env" });
const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URI,
});

client.on("error", (err) => console.log("Redis Client Error", err));

app.listen(process.env.PORT, async () => {
  // Setup database
  await dbService.connect();
  app.dbService = dbService;

  //Setup redis
  await client.connect();
  app.redis = client;
  console.log(`Application listening on port ${process.env.PORT}`);
});

process.on("SIGINT", async () => {
  await dbService.close();
  await client.quit();
  process.exit();
});
