/**
 * Removes the tun.fi prefix from given string
 * @param {string} entry 
 * @returns {string}
 */
function urlRemover(entry) {
  return entry.replace('http://tun.fi/', '')
}

module.exports = urlRemover