const { MongoClient, ObjectId } = require("mongodb");
const uri = "mongodb+srv://admin:admin@test.sslaq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

class DbService {
  async connect() {
    await client.connect();
    this.database = client.db("Adverticement");
    this.adverticements = this.database.collection("adverticements");
  }

  async createAdvertisement(adverticement) {
    const result = await this.adverticements.insertOne(adverticement);
    return result.insertedId;
  }
  
  async find(page, sort = {}) {
    const options = {
      sort,
      projection: {
        _id: 0,
        name: 1,
        price: 1,
        mainPhoto: 1,
      },
      limit: 10,
      skip: 10 * page,
    };
    const result = await this.adverticements.find({}, options).toArray();
    return {
      pagination: {
        page,
        limit: 10,
        count: await this.adverticements.countDocuments(),
      },
      adverticements: result,
    };
  }
  
  async findOne(id, fields = []) {
    const options = {
      projection: {
        _id: 0,
      },
    };
  
    const result = await this.adverticements.findOne({ _id: ObjectId(id) }, options);
    
    if (!fields.includes("description"))
    delete result.description;

    if (!fields.includes("photos"))
    delete result.photos;
    
    return result;
  }
}

module.exports = new DbService();
