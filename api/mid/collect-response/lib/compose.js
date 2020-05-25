

module.exports = (data, tags) => { return new Promise((resolve, reject) => {
  resolve(data)
})}



/*var cardData = {
  title: (meta.ogBasic["og:title"] || meta.basic.title || ''),
  descr: (meta.ogBasic["og:description"] || meta.basic.description || ''),
  //site: (meta.source.split(".").slice(-2).join(".")),
  img: (meta.ogBasic["og:image"] || meta.basic.image || '')
}

cardData.normalized = {
  title: (cardData.title !== "" ? cardData.title + " | " : "") + cardData.site,
  descr: (cardData.descr !== "" ? cardData.descr : null),
  img: (cardData.img !== "" ? cardData.img : null)
}

return res.status(200).json({okay: true, payload: {
  summary: {
    url: u,
    type: meta.ogBasic["og:type"]
  },
  tags: meta,
  card: cardData
}})*/
