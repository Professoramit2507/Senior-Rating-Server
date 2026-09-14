require("dotenv").config();

const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB URI
const uri = `mongodb+srv://${process.env.db_name}:${process.env.db_pass}@cluster0.6qi4vu5.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Database
const database = client.db("Senior_Rating");

// Collection
const seniorCollection = database.collection("senior");

// MongoDB connection
async function run() {
  await client.connect();

  await client.db("admin").command({ ping: 1 });

  console.log("MongoDB connected successfully!");
}

run();


// Root API
app.get("/", (req, res) => {
  res.send("Senior Backend is running");
});


// =======================
// GET ALL SENIORS
// =======================

app.get("/senior", async (req, res) => {
  const result = await seniorCollection.find().toArray();

  res.send(result);
});


// =======================
// POST SENIOR
// =======================

app.post("/senior", async (req, res) => {
  const senior = req.body;

  const result = await seniorCollection.insertOne(senior);

  res.send(result);
});


// Server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
