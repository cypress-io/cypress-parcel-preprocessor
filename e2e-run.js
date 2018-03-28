const cypress = require('cypress')
cypress.run()
  .then(results => {
    console.log(results)
    if (results.tests === 0) {
      throw new Error('Could not find any tests!')
    }
  })
  .catch(e => {
    console.error(e.message)
    process.exit(1)
  })
