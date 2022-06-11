const request = require("supertest");
const app = require("./app.controller");
const dbService = require("./db.service.js");

beforeAll(async () => {
  await dbService.connect();
  app.dbService = dbService;
});

afterAll(async () => {
  await dbService.close();
});

describe("Find many adverticements", () => {
  it("should return first 10 adverticements (without provide a page and sort)", async () => {
    const result = await dbService.find(0);
    return request(app)
      .get("/adverticements")
      .expect(200, result);
  });

  it("should return first 10 adverticements, page in range (without provide sort)", async () => {
    const result = await dbService.find(0);
    return request(app)
      .get("/adverticements")
      .send({ page: 0 })
      .expect(200, result);
  });
  
  it("should throw RangeError, page out of range", async () => {
    // Take max page + 1
    const page = Math.floor(await dbService.adverticements.countDocuments() / 10) + 1;
    
    return request(app)
      .get("/adverticements")
      .send({ page })
      .expect(500, "Error with finding! Page is out of range!");
  });

  it("should sort by name descending", async () => {
    const sort = { name: "desc" };
    const result = await dbService.find(0, sort);
    return request(app)
      .get("/adverticements")
      .send({ page: 0, sort })
      .expect(200, result);
  });

  it("should sort by price descending", async () => {
    const sort = { price: "desc" };
    const result = await dbService.find(0, sort);
    return request(app)
      .get("/adverticements")
      .send({ page: 0, sort })
      .expect(200, result);
  });
});