const app = require("./app.controller");
const dbService = require("./db.service.js");
require('dotenv').config({ path: "./config/.env" });
const port = 3000;

app.listen(port, async () => {
  await dbService.connect();
  app.dbService = dbService;
  console.log(`Application listening on port ${process.env.PORT}`);
});

process.on("SIGINT", async () => {  
  await dbService.close();
  process.exit();
});