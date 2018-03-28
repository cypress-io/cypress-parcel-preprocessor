// @ts-check

const la = require('lazy-ass')
const is = require('check-more-types')
const join = require('path').join
const exists = require('fs').existsSync

/* eslint-env mocha */
describe('cypress-parcel-preprocessor', () => {
  const cyParcel = require('./index')

  it('bundles given file', function () {
    this.timeout(20000)

    const specFilename = join(
      __dirname,
      '..',
      'cypress',
      'integration',
      'spec.js'
    )

    // without extension
    const outputPath = join(__dirname, '..', 'dist', 'spec')

    const emit = () => {}
    const file = {
      filePath: specFilename,
      emit,
      outputPath,
      shouldWatch: false
    }
    return cyParcel(file).then(basename => {
      console.log('finished bundling', basename)
      const filename = basename + '.js'
      la(is.unemptyString(filename), 'expected bundled filename', filename)
      la(exists(filename), 'cannot find output bundle', filename)
    })
  })
})
