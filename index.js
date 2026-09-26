// require("dotenv").config();

// const express = require("express");
// const { MongoClient, ServerApiVersion } = require("mongodb");

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());

// // MongoDB URI
// const uri = `mongodb+srv://${process.env.db_name}:${process.env.db_pass}@cluster0.6qi4vu5.mongodb.net/?appName=Cluster0`;

// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // Database
// const database = client.db("Senior_Rating");

// // Collection
// const seniorCollection = database.collection("senior");

// // MongoDB connection
// async function run() {
//   await client.connect();

//   await client.db("admin").command({ ping: 1 });

//   console.log("MongoDB connected successfully!");
// }

// run();


// // Root API
// app.get("/", (req, res) => {
//   res.send("Senior Backend is running");
// });


// // =======================
// // GET ALL SENIORS
// // =======================

// app.get("/senior", async (req, res) => {
//   const result = await seniorCollection.find().toArray();

//   res.send(result);
// });


// // =======================
// // POST SENIOR
// // =======================

// app.post("/senior", async (req, res) => {
//   const senior = req.body;

//   const result = await seniorCollection.insertOne(senior);

//   res.send(result);
// });


// // Server
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });






require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// =======================
// Middleware
// =======================

app.use(cors());
app.use(express.json());

// =======================
// MongoDB URI
// =======================

const uri = `mongodb+srv://${process.env.db_name}:${process.env.db_pass}@cluster0.6qi4vu5.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// =======================
// Database
// =======================

const database = client.db("Senior_Rating");
const seniorCollection = database.collection("senior");

// =======================
// MongoDB Connection
// =======================

async function run() {
  try {
    await client.connect();

    await client.db("admin").command({
      ping: 1,
    });

    console.log("MongoDB connected successfully!");

    // =======================
    // ROOT
    // =======================

    app.get("/", (req, res) => {
      res.send("Senior Backend is running");
    });

    // =======================
    // GET ALL SENIORS
    // =======================

    app.get("/senior", async (req, res) => {
      try {
        const result = await seniorCollection
          .find({})
          .toArray();

        res.status(200).json(result);
      } catch (error) {
        console.error("GET SENIOR ERROR:", error);

        res.status(500).json({
          message: "Failed to get seniors",
          error: error.message,
        });
      }
    });

    // =======================
    // POST SENIOR
    // =======================

    app.post("/senior", async (req, res) => {
      try {
        const senior = req.body;

        const result =
          await seniorCollection.insertOne(senior);

        res.status(201).json({
          message: "Senior added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("POST SENIOR ERROR:", error);

        res.status(500).json({
          message: "Failed to add senior",
          error: error.message,
        });
      }
    });

    // =======================
    // SERVER
    // =======================

    app.listen(port, () => {
      console.log(
        `Server running on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error
    );
  }
}

run();
