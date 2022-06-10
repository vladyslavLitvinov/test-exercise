import { SSL_OP_NO_TLSv1_1 } from "constants";
import { MongoClient } from "mongodb";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "<connection string uri>";
const client = new MongoClient(uri);

await client.connect();
const database = client.db("Adverticement");
const adverticements = database.collection("adverticements");

async function createAdvertisement(adverticement) {
  const result = await adverticements.insertOne(adverticement);
  return result.insertedId;
}

async function find(page, priceSort, dateSort) {
  const options = {
    projection: {
      _id: 0,
      name: 1,
      price: 1,
      mainPhoto: 1,
      photos: 0,
      description: 0,
    },
    limit: 10,
    skip: 10 * page,
  };
  const result = await advertiseements.find({}, options);
  return {
    pagination: {
      page: 2,
      limit: 10,
      count: 56,
    },
    adverticements: result,
  };
}

async function findOne(id, fields = []) {
  const options = {
    projection: {
      _id: 0,
      name: 1,
      price: 1,
      mainPhoto: 1,
      photos: +fields.includes("photos"),
      description: +fields.includes("description"),
    },
  };

  return await adverticements.findOne({ _id: id }, options);
}

module.exports = { createAdvertisement, find, findOne };
