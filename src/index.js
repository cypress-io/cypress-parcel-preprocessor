// @ts-check
const ParcelBundler = require('parcel-bundler')

const onFile = (file) => {
  console.log('file:preprocessor %s', file.filePath)

  const options = {watch: false}
  const bundler = new ParcelBundler(file.filePath, options)

  return bundler.bundle().then(b => {
    console.log('finished with bundle %s', b.name)
    return b.name
  })
}

module.exports = onFile

// (file) => {
//   console.log('file:preprocessor %s should watch? %j', file.filePath, file.shouldWatch)
//   // TODO handle files that should not be watched

//   if (bundlers[file.filePath]) {
//     return bundlers[file.filePath]
//   }

//   const options = {watch: file.shouldWatch}
//   const bundler = new ParcelBundler(file.filePath, options)

//   bundlers[file.filePath] = new Promise((resolve, reject) => {
//     bundler.on('bundled', (b) => {
//       file.emit('rerun')
//     })
//     bundler.bundle().then(b => {
//       resolve(b.name)
//     })
//   })

//   return bundlers[file.filePath]
// }
