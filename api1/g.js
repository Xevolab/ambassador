/**
 * @Author: francesco
 * @Date:   2020-05-22T21:14:46+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-06-16T11:37:31+02:00
 */

/*

  G
  --- --- ---
  Grab data

 */

const express = require('express');
const router = express.Router();

// CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Cache-Control', 'public, max-age=1500');
  res.header('Content-Type', 'application/json');

  next();
});

// Redis DB connection

require('dotenv').config();
let client = require('redis').createClient(process.env.REDIS_URL, {
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return console.error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 15) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return console.error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
});

let redis = false;
client.on('ready', function() {
  console.log('Redis client connected');
  redis = client;
});
client.on('error', function (err) {
  console.error("Redis connection error ", err);
});

// Payload
const execute = require('./mid/cache-handler/index.js')

// Performance monitor
const { PerformanceObserver, performance } = require('perf_hooks');

router.get(["/", "/:u"], (req, res) => {

  if (typeof req.query.u === "undefined" && typeof req.params.u === "undefined")
    return res.status(400).json({okay: false, error: {errorCode: 'INV_URL', retryable: false}})

  var u = req.query.u || req.params.u;

  if (!RegExp(/^((?:https?:\/\/)[^./]+(?:\.[^./]+)+(?:\/.*)?)$/gi).test(u))
		return res.status(400).json({okay: false, error: {errorCode: 'INV_URL', retryable: false}})

  // Parse query string
  let accParams = ["tags", "card", "schema"];
  let params = {};
  for (var i in accParams)
    params[accParams[i]] = (typeof req.query[accParams[i]] === "string");

  // Detect language
  // Requested --> Req. Headers --> Defaults to en
  if (req.query.language != null || req.query.lang != null)
    params.lang = (req.query.language) || (req.query.lang);
  else {
    if (req.headers["accept-language"] !== undefined)
      reqLanguage = (req.headers["accept-language"].split(",")[0].substr(0,2)) || null;

    params.lang = (reqLanguage != null ? reqLanguage : "en");
  }

  const t0 = performance.now();
  execute(u, params, redis).then((r) => {
    const t1 = performance.now();

    res.status(200).json({okay: true, payload: r.p, service: Math.round(t1 - t0)+"ms", cache: r.c})
  }).catch((e) => {
    const t1 = performance.now();

    res.status(200).json({okay: false, error: e, service: Math.round(t1 - t0)+"ms"})
  })

})

module.exports = router;
