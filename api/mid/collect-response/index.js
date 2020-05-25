
const urlMetadata = require('./../url-meta/index.js')

const compose = require('./lib/compose')

module.exports = (u, tags) => { return new Promise((resolve, reject) => {

  urlMetadata(u, tags).then((data) => {

    let res = {
      request: data.request,
      mime: data.mime
    }

    if (tags.tags)
      res.tags = data.tags;
    if (tags.schema)
      res.schema = data.schema;

    return resolve(res)

  }).catch((e) => {
    return reject(e);
  })

})}
