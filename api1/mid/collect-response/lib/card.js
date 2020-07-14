/**
 * @Author: francesco
 * @Date:   2020-06-15T22:14:31+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-07-12T11:35:03+02:00
 */


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
          img: ((d.tags.ogImage == null ? null : d.tags.ogImage["og:image"]) || d.tags.basic.image || null)
        }

        if (!RegExp(/^((?:https?:\/\/)[^./]+(?:\.[^./]+)+(?:\/.*)?)$/gi).test(cardData.img))
          cardData.img = null;

        break;
      case 'image':
        cardData = {
          title: d.request.uri.split("?")[0].split("/").slice(-1)[0],
          descr: null,
          source: d.request.source,
          img: d.request.uri
        }
        break;
      default:
        cardData = {
          title: d.request.uri.split("?")[0].split("/").slice(-1)[0],
          descr: null,
          source: d.request.source,
          img: null
        }
    }

  } catch (e) {
    return null;
  }

  // Fix img url if relative to site
  // Eg: /imgs/path/image.jpg  --> https://site.ext/imgs/path/image.jpg
  if (cardData.img !== null && cardData.img.substr(0,1) === "/")
    cardData.img = d.request.uri.split("/").slice(0,3).join("/") + cardData.img;

  // Create canonical card
  cardData = {
    valid: (Object.keys(cardData).length > 0),
    original: {
      title: cardData.title,
      descr: cardData.descr,
    },
    canonical: {
      title: (cardData.title !== null ? cardData.title.split(/[\:\|\-\–\!]+/)[0].trim() : null),
      descr: cardData.descr,
    },
    source: cardData.source,
    img: cardData.img
  }
  // Fixing descrition
  if (cardData.canonical.descr !== null && cardData.canonical.descr.length > 150) {
    // Normalize
    cardData.canonical.descr = cardData.canonical.descr.substr(0, 150).split(" ").slice(0, -1);
    // Removing trailing punctuation
    cardData.canonical.descr[cardData.canonical.descr.length - 1] = cardData.canonical.descr[cardData.canonical.descr.length - 1].split(/[\ \.\,\:\;\-\–\_\?\!\«]+/)[0];
    cardData.canonical.descr = cardData.canonical.descr.join(" ");

    if (cardData.original.descr.length > cardData.canonical.descr.length)
      cardData.canonical.descr = cardData.canonical.descr.concat("...")
  }

  return cardData;
}
