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
  } finally {
  }
}
run().catch((error) => console.log(error));
app.listen(port, () => {
  console.log(`Service Review Server running on port ${port}`);
});
