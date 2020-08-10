/**
 * @Author: francesco
 * @Date:   2020-08-07T13:33:42+02:00
 * @Last modified by:   francesco
 * @Last modified time: 2020-08-10T17:00:33+02:00
 */


const cheerio = require('cheerio')

const extractMetaTags = require('./extract-meta-tags')

// Iterative mapping function
const mapTags = require('./map')
// List of all tags and how to map them
const tagsMapping = {
  basic: {
    keyword: ["keyword", null],
    description: ["description", null],
    subject: ["subject", null],
    copyright: ["copyright", null],
    language: ["language", "og:locale", null],
    topic: ["topic", null],
    summary: ["summary", null],
    author: ["author", null],
    designer: ["designer", null],
    'reply-to': ["reply-to", null],
    owner: ["owner", null],
    url: ["html:canonical", "url", null],
    category: ["category", null]
  },
  ogBasic: {
    'og:title': ["og:title", null],
    'og:type': ["og:type", null],
    'og:url': ["og:url", null],
    'og:site_name': ["og:site_name", null],
    'og:description': ["og:description", null],
    'og:locale': [, null]
  },
  ogContacts: {
    'og:email': ["og:email", null],
    'og:phone_number': ["og:phone_number", null],
    'og:fax_number': ["og:fax_number", null]
  },
  ogPosition: {
    'og:latitude': ["og:latitude", null],
    'og:longitude': ["og:longitude", null],
    'og:street-address': ["og:street-address", null],
    'og:locality': ["og:locality", null],
    'og:region': ["og:region", null],
    'og:postal-code': ["og:postal-code", null],
    'og:country-name': ["og:country-name", null]
  },
  ogImage: {
    'og:image': ["og:secure_url", "og:image", null],
    'og:image:height': ["og:image:height", null],
    'og:image:width': ["og:image:width", null],
    'og:image:type': ["og:image:type", null]
  },
  ogVideo: {
    'og:video': ["og:video", null],
    'og:video:height': ["og:video:height", null],
    'og:video:width': ["og:video:width", null],
    'og:video:type': ["og:video:type", null],
    'video:tag': ["video:tag", null],
  },
  ogVideoMovie: {
    'video:actor': ["video:actor", null], // allow array of values
    'video:director': ["video:director", null],
    'video:writer': ["video:writer", null],
    'video:duration': ["video:duration", null],
    'video:release_date': ["video:release_date", null],
  },
  ogVideoEpisode: {
    'video:series': ["video:series", null]
  },
  ogAudio: {
    'og:audio': ["og:audio", null],
    'og:audio:title': ["og:audio:title", null],
    'og:audio:artist': ["og:audio:artist", null],
    'og:audio:album': ["og:audio:album", null],
    'og:audio:type': ["og:audio:type", null]
  },
  ogArticle: {
    'article:published_time': ["og:article:published_time", "article:published_time", "article:published", null],
    'article:modified_time': ["og:article:modified_time", "article:modified_time", "article:modified", null],
    'article:expiration_time': ["og:article:expiration_time", "article:expiration_time", null],
    'article:author': ["og:article:author", "article:author", null],
    'article:section': ["og:article:section", "article:section", null],
    'article:tag': ["og:article:tag", "article:tag", null]
  },
  ogBook: {
    'book:author ': ["og:book:author ", "book:author ", null],
    'book:isbn': ["og:book:isbn", "book:isbn", null],
    'book:release_date': ["og:book:release_date", "book:release_date", null],
    'book:tag': ["book:tag", "book:tag", null]
  },
  twitter: {
    'twitter:card': ["twitter:card", null],
    'twitter:site': ["twitter:site", null],
    'twitter:creator': ["twitter:creator", null],
    'twitter:title': ["twitter:title", null],
    'twitter:description': ["twitter:description", null],
    'twitter:image': ["twitter:image", null],
  },
}

// List of elements cheerio will be trying to extract from the page
const cheerioExtract = [
  ["title", "title"],
  [".title", "title_class"],
  ["#title", "title_id"],
  ["h1", "h1"],
  [".h1", "h1_class"],
  ["h2", "h2"],
  [".h2", "h2_class"]
]

module.exports = function (body) {
  const $ = cheerio.load(body, {decodeEntities: false})
  const scrapedMetaTags = extractMetaTags($)

  // Canonical link
  let canonical = null;
  $('link').each(function (index, el) {
    if (el.attribs && el.attribs.rel === 'canonical' && el.attribs.href) {
      return canonical = el.attribs.href;
    }
  })

  // Mapping tags
  let res = {
    tags: mapTags({...scrapedMetaTags,
      'link:canonical': canonical
    }, tagsMapping),
    dom: {}
  };

  // Extracting from HTML DOM
  for (var i in cheerioExtract) {
    let chr = $(cheerioExtract[i][0]).first().text();
    if (chr !== "")
      res.dom[cheerioExtract[i][1]] = chr;
  }

  try {
    // For the moment, json-ld parsing is disabled as it was not being taken in cosideration anyway...
    //
    // res.schema = JSON.parse($('script[type="application\/ld\+json"]').contents().first().text());
  }
  finally {
    return res;
  }

}
