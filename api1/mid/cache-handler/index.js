
const collect = require('./../collect-response/index.js')
const cache = require('./cache.js')

const pack = (p, c) => {
  return {p, c}
}

// TODO: Analytics on this function gives a pretty complete view at the health of the service

module.exports = (u, params, redis) => { return new Promise((resolve, reject) => {

  let res = {
    collect: 'empty',
    cache: (redis !== false ? 'empty' : 'failed')
  }
  let arrival = [];
  let sent = false;

  collect(u, params).then((r) => {
    updateWatcher("collect", true, r)
  }).catch((e) => {
    updateWatcher("collect", false, e)
  })

  if (redis !== false) {
    cache.get(redis, u).then((r) => {
      updateWatcher("cache", true, r)
    }).catch((e) => {
      updateWatcher("cache", false, e)
    })
  }

  const updateWatcher = (which, pass, payload) => {
    // Handle racing between requests and cache to optimaze service time

    arrival.push(which)

    // Didn't pass -> Set to failed
    if (!pass)
      res[which] = "failed"
    else {
      if (which === "cache")
        res[which] = JSON.parse(payload)
      else
        res[which] = payload
    }

    // Handle errors first

    // Cache failed, results in
    if (res.cache === "failed" && res.collect !== "empty") {
      console.log("Cache error, sent collect for ", u);
      return resolve(pack(res.collect, {cached: false}))
    }

    // Both failed 😱
    if (res.collect === "failed" && (res.cache === "failed" || res.cache === null)) {
      // Collect just failed --> I still have the error code
      if (which === "collect")
        return reject(payload)
      else
        return reject('GEN_ERROR')
    }



    // Response still empty but cache returned something
    //
    // Send back the cache and that's it
    if (res.collect === "empty" && (res.cache !== null && res.cache !== "empty")) {
      for (var i in params) {
        // A requried param is not available
        // Pretend cache doesn't exist and re-cache
        if (params[i] && res.cache.data[i] === undefined) {
          console.log("Re-caching ", u);
          res.cache = "recache";
          return;
        }

        // More params than requested
        // Serve cached but remove extra params
        if (!params[i] && res.cache.data[i] !== undefined) {
          delete res.cache.data[i];
        }
      }

      console.log("Cache won for ", u);
      sent = true;
      return resolve(pack(res.cache.data, {cached: true, cachedAt: res.cache.cachedAt}))
    }

    // If response is in and cache is empty or not ready
    //
    // Return the response but keep crunching the data (Something may need update)
    if (res.collect !== "empty" && (res.cache !== "empty" || res.cache !== "failed") && !sent) {
      console.log("Collect won for ", u);
      resolve(pack(res.collect, {cached: false}));
      sent = true;
    }

    // Both are now in
    //
    // Check how and when the results came back
    if ((res.collect !== "empty" && res.collect !== "failed") && res.cache !== "empty") {

      // Arrived in a weird order and not caught earlier 🤷🏻‍
      if (arrival[0] === "cache" && arrival[1] === "collect" && (res.cache !== "recache" && res.cache !== null && res.cache !== "failed")) {
        if (!sent)
          resolve(pack(res.collect, {cached: false}));
        return;
      }

      // Cache was just slower to arrive
      if (res.cache !== null && res.cache !== "recache")
        return;

      // Update cache
      console.log("Updating cache for ", u);
      return cache.set(redis, u, res.collect).catch((e) => {
        console.error("Redis set error ", e);
      })
    }
  }

})}
