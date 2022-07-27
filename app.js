require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/unicorn', canUse('unicorn'), (req, res) => {
  res.send('<h1>Hello Unicorns!</h1>')
})

app.get('/dragon', canUse('dragon'), (req, res) => {
  res.send('<h1>Hello Dragons!</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/**
 *  Get the feature config
 *  Features here are toggled on/off by an environment variable
 *  A more advanced check would have a user context and could check permissions or some user specific config
 *
 * @returns {{dragon: (string|boolean), unicorn: (string|boolean)}}
 */
function getFeatureConfig () {
  return {
    unicorn: process.env.ENABLE_FEATURE_UNICORN === 'true' || false,
    dragon: process.env.ENABLE_FEATURE_DRAGON === 'true' || false
  }
}

/**
 * Checks the config to see if the feature is enabled
 * @param feature
 * @returns {boolean}
 */
function isFeatureEnabled(feature) {
  return getFeatureConfig()[feature] === true
}

/**
 * Controls if the feature should be executed or not
 * @param feature
 * @returns {(function(*, *, *): void)|*}
 */
function canUse (feature) {
  return (req, res, next) => {
    if (isFeatureEnabled(feature)) {
      // If the feature is enabled then carry on and use it
      next()
    } else {
      // If the feature is not enabled then return an error
      res.status(404).send('<h1>Not found</h1>')
    }
  }
}
