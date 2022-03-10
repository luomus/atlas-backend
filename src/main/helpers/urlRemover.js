function urlRemover(entry) {
  return entry.replace('http://tun.fi/', '')
}

module.exports = urlRemover