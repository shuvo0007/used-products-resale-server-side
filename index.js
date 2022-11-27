const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { ObjectID, ObjectId } = require("bson");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Service Review Server Running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zfaesfn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("e-commerce").collection("laptop");
    app.get("/laptop", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const category = await cursor.toArray();
      res.send(category);
    });
    app.post("/laptop", async (req, res) => {
      const category = req.body;
      const allCategory = await userCollection.insertOne(category);
      res.send(allCategory);
    });
    app.get("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const laptop = await userCollection.findOne(query);
      res.send(laptop);
    });
    app.put("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const laptop = req.body;
      const option = { upset: true };
      const updateLaptop = {
        $set: {
          advertised: laptop.advertised,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updateLaptop,
        option
      );
      res.send(result);
    });
    app.delete("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));
app.listen(port, () => {
  console.log(`Service Review Server running on port ${port}`);
});
