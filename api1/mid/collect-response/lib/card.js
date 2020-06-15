module.exports = (d) => {

  var cardData = {};

  try {

    switch (d.mime.type) {
      case 'html':
        // Nothing to do
        if (d.tags === null && d.schema === null)
          return null;

        cardData = {
          title: ((d.tags.ogBasic == null ? null : d.tags.ogBasic["og:title"]) || d.tags.basic.htmltitle || null),
          descr: ((d.tags.ogBasic == null ? null : d.tags.ogBasic["og:description"]) || d.tags.basic.description || null),
          source: d.request.source,
          img: ((d.tags.ogImage == null ? null : d.tags.ogImage["og:image"]) || d.tags.basic.image || null),
          img_alt: ((d.tags.ogImage == null ? null : d.tags.ogImage["og:image:alt"]) || null)
        }
        break;
      case 'image':
        cardData = {
          title: d.request.uri.split("?")[0].split("/").slice(-1)[0],
          descr: null,
          source: d.request.source,
          img: d.request.uri,
          img_alt: null
        }
        break;
      default:
        cardData = {
          title: d.request.uri.split("?")[0].split("/").slice(-1)[0],
          descr: null,
          source: d.request.source,
          img: null,
          img_alt: null
        }
    }

  } catch (e) {
    return null;
  }

  // Fix img url if relative to site
  // Eg: /imgs/path/image.jpg  --> https://site.ext/imgs/path/image.jpg
  if (cardData.img !== null && cardData.img.substr(0,1) === "/")
    cardData.img = d.request.uri.split("/").slice(0,3).join("/") + cardData.img;

  return cardData;
}
