// @ts-check
const cyParcel = require('../../src')
module.exports = (on, config) => {
  on('file:preprocessor', cyParcel)
}
