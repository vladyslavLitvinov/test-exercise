const request = require("supertest");
const app = require("./app.controller");
const dbService = require("./db.service.js");
require("dotenv").config({ path: "./config/.env" });
const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URI,
});

beforeAll(async () => {
  await dbService.connect();
  app.dbService = dbService;

  await client.connect();
  app.redis = client;
});

afterAll(async () => {
  await dbService.close();
  await client.quit();
});

describe("Find many adverticements", () => {
  it("should return first 10 adverticements (without provide a page and sort)", async () => {
    const result = await dbService.find(0);
    return request(app).get("/adverticements").expect(200, result);
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
    const page =
      Math.floor((await dbService.adverticements.countDocuments()) / 10) + 1;

    return request(app)
      .get("/adverticements")
      .send({ page })
      .expect(500, "Error with finding! Page is out of range!");
  });

  it("should sort by price descending", async () => {
    const sort = { price: "desc" };
    const result = await dbService.find(0, sort);
    return request(app)
      .get("/adverticements")
      .send({ page: 0, sort })
      .expect(200, result);
  });

  it("should sort by date descending", async () => {
    const sort = { date: "desc" };
    const result = await dbService.find(0, sort);
    return request(app)
      .get("/adverticements")
      .send({ page: 0, sort })
      .expect(200, result);
  });
});

describe("Find one adverticement", () => {
  const id = "62a5cfc35758f44a6d3896ce";

  it("shold return status not found", async () => {
    const id = "62a5cfc35758f44a6d3896cf";
    return request(app)
      .get(`/adverticements/${id}`)
      .expect(404, `Adverticement not found! Id ${id} not found!`);
  });

  it("without fields", async () => {
    const result = await dbService.findOne(id);
    return request(app).get(`/adverticements/${id}`).expect(200, result);
  });

  it("with description field", async () => {
    const fields = ["description"];
    const result = await dbService.findOne(id, fields);
    return request(app)
      .get(`/adverticements/${id}`)
      .send({ fields })
      .expect(200, result);
  });

  it("with photo field", async () => {
    const fields = ["photos"];
    const result = await dbService.findOne(id, fields);
    return request(app)
      .get(`/adverticements/${id}`)
      .send({ fields })
      .expect(200, result);
  });

  it("with both fields", async () => {
    const fields = ["description", "photos"];
    const result = await dbService.findOne(id, fields);
    return request(app)
      .get(`/adverticements/${id}`)
      .send({ fields })
      .expect(200, result);
  });
});

describe("Create an adverticement", () => {
  const date = Date.now();
  const name = "name" + date;
  const description = "description" + date;
  const photos = ["photo" + date];
  const price = date;

  it("should return Unprocessable Entity without providing name", () => {
    return request(app).post("/adverticements").expect(422, "Invalid name!");
  });

  it("should return Unprocessable Entity providing name > 200 symbols", () => {
    const name = new Array(201).fill(0).join("");
    return request(app)
      .post("/adverticements")
      .send({ name })
      .expect(422, "Invalid name!");
  });

  it("should return Unprocessable Entity without providing description", () => {
    return request(app)
      .post("/adverticements")
      .send({ name })
      .expect(422, "Invalid description!");
  });

  it("should return Unprocessable Entity providing description > 1000 symbols", () => {
    const description = new Array(1001).fill(0).join("");
    return request(app)
      .post("/adverticements")
      .send({ name, description })
      .expect(422, "Invalid description!");
  });

  it("should return Unprocessable Entity without providing photos", () => {
    return request(app)
      .post("/adverticements")
      .send({ name, description })
      .expect(422, "Invalid photos!");
  });

  it("should return Unprocessable Entity providing > 3 photos", () => {
    return request(app)
      .post("/adverticements")
      .send({ name, description, photos: ["1", "2", "3", "4"] })
      .expect(422, "Invalid photos!");
  });

  it("should return Unprocessable Entity providing 0 photos", () => {
    return request(app)
      .post("/adverticements")
      .send({ name, description, photos: [] })
      .expect(422, "Invalid photos!");
  });

  it("should create an adverticement", async () => {
    const adverticement = { name, description, photos, price };
    const responce = await request(app)
      .post("/adverticements")
      .send(adverticement);
    adverticement.mainPhoto = photos[0];
    expect(
      await dbService.findOne(responce.body, ["description", "photos"])
    ).toEqual(adverticement);
  });
});
