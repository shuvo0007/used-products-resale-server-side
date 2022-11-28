const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { ObjectID, ObjectId } = require("bson");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { request } = require("express");

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
    const laptopCollection = client.db("e-commerce").collection("laptop");
    const userCollection = client.db("e-commerce").collection("users");
    const selectedLaptop = client
      .db("e-commerce")
      .collection("selected-laptop");

    // --------------------------------------------------all laptop collection--------------------------------------------------------

    app.get("/laptop", async (req, res) => {
      const query = {};
      const cursor = laptopCollection.find(query);
      const category = await cursor.toArray();
      res.send(category);
    });

    app.post("/laptop", async (req, res) => {
      const category = req.body;

      const allCategory = await laptopCollection.insertOne(category);
      res.send(allCategory);
    });

    app.put("/laptop/:id", async (req, res) => {
      const id = req.body.id;
      console.log(req.body);
      const isPaid = req.body.isPaid;
      const filter = { _id: ObjectId(id) };
      const option = { upset: true };
      const updateLaptop = {
        $set: {
          advertised: true,
          paid: isPaid ? true : false,
        },
      };
      const result = await laptopCollection.updateOne(
        filter,
        updateLaptop,
        option
      );
      res.send(result);
    });

    app.delete("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await laptopCollection.deleteOne(query);
      res.send(result);
    });

    // --------------------------------------------------all laptop wishlisted--------------------------------------------------------

    app.get("/selected-laptop", async (req, res) => {
      const query = {};
      const cursor = selectedLaptop.find(query);
      const allSelected = await cursor.toArray();
      res.send(allSelected);
    });
    app.post("/selected-laptop", async (req, res) => {
      const category = req.body;
      const allSelected = await selectedLaptop.insertOne(category);
      res.send(allSelected);
    });

    app.get("/laptop/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const laptop = await laptopCollection.findOne(query);
      res.send(laptop);
    });
  } finally {
  }
}
run().catch((error) => console.log(error));
app.listen(port, () => {
  console.log(`Service Review Server running on port ${port}`);
});
