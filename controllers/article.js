const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Article = require("../models/Article");

// GET list articles
router.get('/api/articles', (req, res, next) =>{
  
});