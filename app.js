const http = require('http');
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const errorhandler = require('errorhandler');


const port = process.env.PORT || 3000;
const server = http.createServer(app);

mongoose.connect('mongodb://admin:123456@ds111390.mlab.com:11390/lion');// { useMongoClient: true }

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

require('./models/User');
//require('./models/Article');

// Routes which should handle requests
// app.use(require('./auth').isAuthenticated());
app.use(require('./controllers/user'));
// app.use(require('./controllers/article'));

app.use(errorhandler());
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