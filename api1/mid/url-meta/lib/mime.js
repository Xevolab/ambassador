// Mimetype - Ext - Cat
const mapping = {
  'audio/aac': ['.aac', 'audio'],
  'video/x-msvideo': ['.avi', 'video'],
  'application/vnd.amazon.ebook': ['.azw', 'ebook'],
  'application/octet-stream': ['.bin', 'binary'],
  'image/bmp': ['.bmp', 'image'],
  'application/x-bzip': ['.bz', 'archive'],
  'application/x-bzip2': ['.bz2', 'archive'],
  'text/css': ['.css', 'text'],
  'text/csv': ['.csv', 'text'],
  'application/msword': ['.doc', 'application'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx', 'application'],
  'application/epub+zip': ['.epub', 'ebook'],
  'application/gzip': ['.gz', 'archive'],
  'image/gif': ['.gif', 'image'],
  'text/html': ['.html', 'html'],
  'image/vnd.microsoft.icon': ['.ico', 'image'],
  'text/calendar': ['.ics', 'calendar'],
  'application/java-archive': ['.jar', 'archive'],
  'image/jpeg': ['.jpeg', 'image'],
  'text/javascript': ['.js', 'text'],
  'application/json': ['.json', 'text'],
  'application/ld+json': ['.jsonld', 'text'],
  'audio/midi': ['.mid', 'audio'],
  'audio/midi': ['.midi', 'audio'],
  'audio/mpeg': ['.mp3', 'audio'],
  'video/mpeg': ['.mpeg', 'audio'],
  'application/vnd.apple.installer+xml': ['.mpkg', 'archive'],
  'application/vnd.oasis.opendocument.presentation': ['.odp', 'application'],
  'application/vnd.oasis.opendocument.spreadsheet': ['.ods', 'application'],
  'application/vnd.oasis.opendocument.text': ['.odt', 'application'],
  'audio/ogg': ['.oga', 'audio'],
  'video/ogg': ['.ogv', 'video'],
  'application/ogg': ['.ogx', 'audio'],
  'audio/opus': ['.opus', 'audio'],
  'font/otf': ['.otf', 'font'],
  'image/png': ['.png', 'image'],
  'application/pdf': ['.pdf', 'pdf'],
  'application/x-httpd-php': ['.php', 'text'],
  'application/vnd.ms-powerpoint': ['.ppt', 'application'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx', 'application'],
  'application/vnd.rar': ['.rar', 'archive'],
  'application/rtf': ['.rtf', 'text'],
  'image/svg+xml': ['.svg', 'image'],
  'application/x-shockwave-flash': ['.swf', 'application'],
  'application/x-tar': ['.tar', 'archive'],
  'image/tiff': ['.tiff','image'],
  'image/tiff': ['.tif','image'],
  'video/mp2t': ['.ts', 'video'],
  'font/ttf': ['.ttf', 'font'],
  'text/plain': ['.txt', 'text'],
  'audio/wav': ['.wav', 'audio'],
  'audio/webm': ['.weba', 'audio'],
  'video/webm': ['.webm', 'video'],
  'image/webp': ['.webp', 'image'],
  'font/woff': ['.woff', 'font'],
  'font/woff2': ['.woff2', 'font'],
  'application/xhtml+xml': ['.xhtml', 'html'],
  'application/vnd.ms-excel': ['.xls', 'application'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx', 'application'],
  'application/xml ': ['.xml', 'text'],
  'application/zip': ['.zip', 'archive'],
  'video/3gpp': ['.3gp', 'video'],
  'audio/3gpp': ['.3gp', 'audio'],
  'video/3gpp2': ['.3g2', 'video'],
  'audio/3gpp2': ['.3g2', 'audio'],
  'application/x-7z-compressed': ['.7z', 'archive']
}

module.exports = (mime) => {

  mime = mime.toLowerCase().split(";")[0];
  var res = mapping[mime];
  if (res === undefined)
    return {mime};

  return {
    mime,
    extension: res[0],
    type: res[1]
  }

}
