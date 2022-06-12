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
    const limit = 10;
    const countDocuments = await this.adverticements.countDocuments();
    if (page > Math.floor(countDocuments / limit) || page < 0) {
      throw new RangeError("Page is out of range!");
    }

    const options = {
      sort,
      projection: {
        _id: 0,
        name: 1,
        price: 1,
        mainPhoto: 1,
      },
      limit,
      skip: 10 * page,
    };

    const result = await this.adverticements.find({}, options).toArray();
    return {
      pagination: {
        page,
        limit: 10,
        count: countDocuments,
      },
      adverticements: result,
    };
  }
  
  async findOne(id, fields = []) {
    const options = {
      projection: {
        _id: 0,
        date: 0,
      },
    };
  
    const result = await this.adverticements.findOne({ _id: ObjectId(id) }, options);

    if (!result) throw new Error(`Id ${id} not found!`)
    
    if (!fields.includes("description"))
    delete result.description;

    if (!fields.includes("photos"))
    delete result.photos;
    
    return result;
  }

  async close() {
    await client.close();
  }
}

module.exports = new DbService();
