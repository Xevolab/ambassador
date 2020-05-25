/**
 * @Author: francesco
 * @Date:   2020-05-22T21:15:21+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-05-22T21:56:32+02:00
 */


const express = require("express");
const path = require("path");

const app = express();
const http = require('http').createServer(app);

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*.xevolab.com");
  res.header("Access-Control-Allow-Method", "GET");
  res.header('Cache-Control', 'public, max-age=1500');
  res.header('Content-Type', 'application/json');

  next();
});


// API entry point
app.use('/', require('./api/g.js'));

// Starting the server
const PORT = process.env.PORT || 3300;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
