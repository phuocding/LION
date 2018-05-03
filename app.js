const http = require('http');
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = process.env.PORT || 3000;
const server = http.createServer(app);


const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Mongoose connection: ERROR');
  throw new Error(error);
});

db.once('open', () => {
  console.log('Mongoose connection: CONNECTED');
});
mongoose.connect('mongodb://admin:123456@ds111390.mlab.com:11390/lion');// { useMongoClient: true }

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

require('./models/User');
require('./models/Article');

// Routes which should handle requests
app.use(require('./controllers/user'));
// app.use(require('./controllers/article'));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

server.listen(port, () => {
  console.log(`The magic happens on port localhost:${port}/api`);
})