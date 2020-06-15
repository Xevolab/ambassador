
const urlMetadata = require('./../url-meta/index.js')

module.exports = (u, tags) => { return new Promise((resolve, reject) => {

  urlMetadata(u, tags).then((data) => {

    let res = {
      request: data.request,
      mime: data.mime
    }

    if (tags.tags)
      res.tags = data.tags || null;
    if (tags.schema)
      res.schema = data.schema || null;
    if (tags.card)
      res.card = require('./lib/card')(data)

    return resolve(res)

  }).catch((e) => {
    console.log(e);
    return reject(e);
  })

})}
