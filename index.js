const express = require('express')
const app = express()
const cors =require('cors');
const bobyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bobyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bghwt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const serviceCollection = client.db("PaintShack").collection("services");
  const orderList = client.db("PaintShack").collection("orders");
  const adminList = client.db("PaintShack").collection("admins");
  const reviewList = client.db("PaintShack").collection("reviews");

  app.post("/addService", (req, res) => {
    const data = req.body;
    console.log(data)
    serviceCollection.insertOne(data).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/service", (req, res) => {
    serviceCollection.find({}).toArray((err, items) => {
      console.log(err);
      res.send(items);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    serviceCollection.deleteOne({ _id: id }).then((document) => {
      res.send(document);
    });
  });

  app.get("/singleService/:id", (req, res) => {
    serviceCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        console.log(err);
        res.send(document);
      });
  });

  app.post("/placeOrder", (req, res) => {
    const userInfo = req.body;
    console.log(req.body);
    orderList.insertOne(userInfo).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orderList", (req, res) => {
    orderList.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  app.get("/singleOrder/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    orderList.find({ _id: id }).toArray((err, document) => {
      console.log(err);
      res.send(document);
    });
  });

  app.patch("/updateStatus/:id", (req, res) => {
    const newInfo = req.body;
    const id = ObjectId(req.params.id);
    orderList
      .findOneAndUpdate({ _id: id }, { $set: { status: newInfo.status } })
      .then((err, result) => {
        console.log(err);
        console.log(result);
      });
  });

  app.post("/addAdmin", (req, res) => {
    const admin = req.body;
    adminList.insertOne(admin).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/adminList", (req, res) => {
    adminList.find({}).toArray((err, result) => {
      res.send(result);
    });
  });

  app.post("/addReview", (req, res) => {
    const data = req.body;
    reviewList.insertOne(data).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/reviewList", (req, res) => {
    reviewList.find({}).toArray((err, document) => {
      console.log(err);
      res.send(document);
    });
  });

  app.get("/bookingList", (req, res) => {
    const email = req.query.email;
    orderList.find({ email: email }).toArray((err, document) => {
      res.send(document);
    });
  });
});

app.listen(port, () => {
  console.log(port)
})
