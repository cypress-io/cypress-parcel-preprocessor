// @ts-check

const la = require('lazy-ass')
const is = require('check-more-types')
const join = require('path').join
const exists = require('fs').existsSync

/* eslint-env mocha */
describe('cypress-parcel-preprocessor', () => {
  const cyParcel = require('./index')

  it('bundles given file', () => {
    const specFilename = join(
      __dirname,
      '..',
      'cypress',
      'integration',
      'spec.js'
    )
    const emit = () => {}
    return cyParcel({ filePath: specFilename, emit }).then(filename => {
      la(is.unemptyString(filename), 'expected bundled filename', filename)
      la(exists(filename), 'cannot find output bundle', filename)
    })
  })
})
