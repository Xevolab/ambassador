module.exports = (req, tags, schema) => {

  // Nothing to do
  if (tags === null && schema === null)
    return null;

  var cardData = {
    title: ((tags.ogBasic == null ? null : tags.ogBasic["og:title"]) || tags.basic.htmltitle || null),
    descr: ((tags.ogBasic == null ? null : tags.ogBasic["og:description"]) || tags.basic.description || null),
    site: req.source,
    img: ((tags.ogBasic == null ? null : tags.ogBasic["og:image"]) || tags.basic.image || null)
  }

  return cardData;
}
