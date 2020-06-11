const crypto = require("crypto");

const get = (redis, u, lang) => {return new Promise(async (resolve, reject) => {

  // Keys as SHA256 hashes of the link
  u = lang+"-"+crypto.createHash('sha256').update(u).digest("hex");

  redis.get(u, function(err, res) {
    if (err)
      reject(err)

    resolve(res)
  });

})}
const set = (redis, u, p, lang) => {return new Promise(async (resolve, reject) => {

  // Save items to Redis as cache
  // For 1 hour

  // Keys as SHA256 hashes of the link
  u = lang+"-"+crypto.createHash('sha256').update(u).digest("hex");

  // Add caching information to payload
  p = {data: p, cachedAt: Date.now()}

  // Convert payload to JSON string
  p = JSON.stringify(p);

  // Create Redis Element
  redis.set(u, p, function(err, res) {
    if (err)
      reject(err)

    redis.expire(u, 60*60)
    resolve(res)
  });

})}

module.exports = {get, set}
