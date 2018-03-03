// @ts-check
const debug = require('debug')('cypress-parcel-preprocessor')
const ParcelBundler = require('parcel-bundler')

const bundlers = {}

const bundleOnce = filePath => {
  const bundler = new ParcelBundler(filePath, { watch: false })
  return bundler.bundle().then(b => b.name)
}

const onFile = file => {
  const { filePath, shouldWatch } = file
  debug('file:preprocessor %s', filePath)

  if (bundlers[filePath]) {
    debug('file already bundled %s', filePath)
    return bundlers[filePath]
  }

  if (!shouldWatch) {
    return bundleOnce(filePath)
  }

  const options = {
    watch: shouldWatch,
    // make output simpler and avoid possible conflicts with Cypress
    // by NOT having hot module reloading
    hmr: false
  }
  const bundler = new ParcelBundler(filePath, options)

  bundlers[filePath] = new Promise((resolve, reject) => {
    bundler.on('bundled', b => {
      debug('bundled %s', filePath)
      debug('into %s', b.name)
      file.emit('rerun')
      resolve(b.name)
    })
    bundler.bundle().catch(reject)
  })

  // TODO: add cleanup when watching the file is no longer necessary
  return bundlers[filePath]
}

module.exports = onFile
