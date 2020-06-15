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

// API entry point
app.use(['/1/', '/v1/'], require('./api1/g.js'));

// Set a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
const PORT = process.env.PORT || 3300;

http.listen(PORT, () => console.log(`Server started on port ${PORT}`));
