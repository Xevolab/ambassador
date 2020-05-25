
module.exports = (data, tagsMapping) => {
  let ind = {};
  let res = {};

  // Keys to lower case
  for (var v in data) {
    ind[v.toLowerCase()] = data[v];
  }

  return iterativeMap(ind, tagsMapping, res);
};

// Iteratively go through the whole mapping object
// assigning every raw tag to the specific exit point
//
const iterativeMap = (data, t, r) => {
  r = {}
  for (var e in t) {
    if (t[e] !== null && typeof t[e] === "object" && t[e].length === undefined) {
      // Object
      // Process the content
      //
      r[e] = iterativeMap(data, t[e], r[e]);
      if (Object.keys(r[e]).length === 0)
        delete r[e];
      continue;
    }

    if (t[e] !== null && typeof t === "object" && t[e].length > 0) {
      // Not an object --> list
      // Compare items in order of appearance
      // First is most important
      //
      let comparator = data[t[e][0]] || null;
      for (var li in t[e]) {
        comparator = comparator || data[t[e][li]] || null;
      }

      if (comparator !== null)
        r[e] = cleanString(comparator)

    }
  }

  return r;
}

const cleanString = function (value) {
  if (typeof value !== 'string') return value
  // remove any newline characters, replace with space:
  value = value.replace(/\n|\r/gm, ' ')
  // remove double (or more) spaces, replace with single space:
  value = value.replace(/( {2,})/gm, ' ')
  return value
}
