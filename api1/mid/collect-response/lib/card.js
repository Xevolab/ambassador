module.exports = (d) => {

  var cardData = {};

  switch (d.mime.type) {
    case 'html':
      // Nothing to do
      if (d.tags === null && d.schema === null)
        return null;

      cardData = {
        title: ((d.tags.ogBasic == null ? null : d.tags.ogBasic["og:title"]) || d.tags.basic.htmltitle || null),
        descr: ((d.tags.ogBasic == null ? null : d.tags.ogBasic["og:description"]) || d.tags.basic.description || null),
        site: d.request.source,
        img: ((d.tags.ogImage == null ? null : d.tags.ogImage["og:image"]) || d.tags.basic.image || null),
        img_alt: ((d.tags.ogImage == null ? null : d.tags.ogImage["og:image:alt"]) || null)
      }
      break;
    case 'image':
      cardData = {
        title: d.request.uri.split("?")[0].split("/").slice(-1)[0],
        descr: null,
        site: d.request.source,
        img: d.request.uri,
        img_alt: null
      }
      break;
    default:
      cardData = {
        title: d.request.uri.split("?")[0].split("/").slice(-1)[0],
        descr: null,
        site: d.request.source,
        img: null,
        img_alt: null
      }
  }



  return cardData;
}
