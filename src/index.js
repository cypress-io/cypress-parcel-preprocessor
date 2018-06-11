// @ts-check
const debug = require('debug')('cypress-parcel-preprocessor')
const ParcelBundler = require('parcel-bundler')
const path = require('path')

const bundlers = {}

const bundleOnce = (filePath, outDir, outFile) => {
  // seems parcel-bundler 1.7.0 does not want extension in the output filename
  // TODO handle any filename extension
  const basename = path.basename(outFile, '.js')
  const options = {
    watch: false,
    hmr: false,
    outFile: basename,
    outDir
  }
  const bundler = new ParcelBundler(filePath, options)
  return bundler.bundle()
}

const onFile = file => {
  const { filePath, shouldWatch, outputPath } = file
  debug('file:preprocessor %s', filePath)

  const outDir = path.dirname(outputPath)
  const outFile = path.basename(outputPath)

  if (bundlers[filePath]) {
    debug('file already bundled %s', filePath)
    return bundlers[filePath]
  }

  if (!shouldWatch) {
    debug('bundle file once without watching to %s', outputPath)
    // TODO handle possible errors
    return bundleOnce(filePath, outDir, outFile).then(_ => outputPath)
  }

  // instead of temp folder for output files, use default "dist" folder
  // this way the source maps are created and served next to the bundle
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
    // TODO handle error events bundler.on('error')
    bundler.bundle().catch(reject)
  })

  // TODO: add cleanup when watching the file is no longer necessary
  return bundlers[filePath]
}

module.exports = onFile
