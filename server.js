const app = require("./app.controller");
const dbService = require("./db.service.js");
const port = 3000;

app.listen(port, async () => {
  await dbService.connect();
  app.dbService = dbService;
  console.log(`Application listening on port ${port}`);
});

process.on("SIGINT", async () => {  
  await dbService.close();
  process.exit();
});