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
const userCollection = database.collection("users");
const reviewCollection = database.collection("reviews");

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
      res.send("Senior Rating Backend is running 🚀");
    });

    // =====================================================
    // SENIORS
    // =====================================================

    // GET ALL SENIORS

    app.get("/senior", async (req, res) => {
      try {
        const result = await seniorCollection.find({}).toArray();

        res.status(200).json(result);
      } catch (error) {
        console.error("GET SENIOR ERROR:", error);

        res.status(500).json({
          message: "Failed to get seniors",
          error: error.message,
        });
      }
    });

    // POST SENIOR

    app.post("/senior", async (req, res) => {
      try {
        const senior = req.body;

        const result = await seniorCollection.insertOne(senior);

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

    // =====================================================
    // USERS
    // =====================================================

    // GET ALL USERS

    app.get("/users", async (req, res) => {
      try {
        const result = await userCollection
          .find({})
          .sort({ _id: -1 })
          .toArray();

        res.status(200).json(result);
      } catch (error) {
        console.error("GET USERS ERROR:", error);

        res.status(500).json({
          message: "Failed to get users",
          error: error.message,
        });
      }
    });

    // GET SINGLE USER BY EMAIL

    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const user = await userCollection.findOne({
          email: email,
        });

        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        res.status(200).json(user);
      } catch (error) {
        console.error("GET USER ERROR:", error);

        res.status(500).json({
          message: "Failed to get user",
          error: error.message,
        });
      }
    });

    // POST USER

    app.post("/users", async (req, res) => {
      try {
        const user = req.body;

        if (!user.email) {
          return res.status(400).json({
            message: "Email is required",
          });
        }

        // Check duplicate user
        const existingUser = await userCollection.findOne({
          email: user.email,
        });

        if (existingUser) {
          return res.status(409).json({
            message: "User already exists",
          });
        }

        const result = await userCollection.insertOne(user);

        res.status(201).json({
          message: "User added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("POST USER ERROR:", error);

        res.status(500).json({
          message: "Failed to add user",
          error: error.message,
        });
      }
    });




    //admi assign
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const user = await userCollection.findOne({
          email: email,
        });

        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({
          message: "Failed to get user",
          error: error.message,
        });
      }
    });


    

    // =====================================================
    // REVIEWS
    // =====================================================

    // GET ALL REVIEWS

    app.get("/reviews", async (req, res) => {
      try {
        const result = await reviewCollection
          .find({})
          .sort({ _id: -1 })
          .toArray();

        res.status(200).json(result);
      } catch (error) {
        console.error("GET REVIEWS ERROR:", error);

        res.status(500).json({
          message: "Failed to get reviews",
          error: error.message,
        });
      }
    });

    // POST REVIEW

    app.post("/reviews", async (req, res) => {
      try {
        const review = req.body;

        if (!review.seniorId) {
          return res.status(400).json({
            message: "Senior ID is required",
          });
        }

        const result = await reviewCollection.insertOne(review);

        res.status(201).json({
          message: "Review added successfully",
          insertedId: result.insertedId,
        });
      } catch (error) {
        console.error("POST REVIEW ERROR:", error);

        res.status(500).json({
          message: "Failed to add review",
          error: error.message,
        });
      }
    });

    // =====================================================
    // SERVER
    // =====================================================

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

run();
