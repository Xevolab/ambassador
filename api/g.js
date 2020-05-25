/**
 * @Author: francesco
 * @Date:   2020-05-22T21:14:46+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-05-22T22:11:25+02:00
 */

/*

  G
  --- --- ---
  Grab data

 */

const express = require('express');
const router = express.Router();

const collect = require('./mid/collect-response/index.js')

const { PerformanceObserver, performance } = require('perf_hooks');

router.get("/a", (req, res) => {

  if (typeof req.query.u === "undefined")
    return res.status(400).json({okay: false})

  var u = req.query.u;

  if (!RegExp(/^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/gi).test(u))
		return res.status(400).json({okay: false})

  // Parse query string
  let accParams = ["basic", "tags", "card", "schema"];
  let params = [];
  for (var i in accParams)
    params[accParams[i]] = (typeof req.query[accParams[i]] === "string");

  const t0 = performance.now();
  collect(u, params).then((r) => {
    const t1 = performance.now();
    console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    res.status(200).json({okay: true, params, payload: r})
  }).catch((e) => {
    res.status(200).json({okay: false, params, error: e})
  })

})

module.exports = router;
