const express = require('express')
const app = express()
const PORT = 9000

const sunscreens = {
  'supergoop unseen sunscreen': {
    'brand': 'supergoop!',
    'name': 'unseen sunscreen',
    'spf': 40,
    'imageURL': 'https://supergoop.com/_cdn/A5I9PbaFjQo69uIottl6Hz/output=format:webp/cache=expiry:max/resize=width:1080%2cfit:max/quality=value:75/__N__1/https%3A/cdn.shopify.com/s/files/1/1503/5658/products/supergoop-unseen-sunscreen-spf-40-50ml.jpg?v=1623708290',
  },
  'beauty of joseon relief sun': {
    'brand': 'beauty of joseon',
    'name': 'relief sun: rice + probiotics',
    'spf': 50,
    'imageURL': 'https://i.ebayimg.com/images/g/8AMAAOSw~dNjo4JG/s-l1600.png'
  },
  'unknown': {
    'brand': 'unknown',
    'name': 'unknown',
    'spf': 'unknown',
    'imageURL': 'unknown'
  },
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/api/:query', (req, res) => {
  let query = req.params.query.toLowerCase()
  if (sunscreens[query]) {
    res.json(sunscreens[query])
  } else {
    res.json(sunscreens['unknown'])
  }
})

app.listen(process.env.PORT || PORT, () => {
  console.log(`The server is running on port ${PORT}.`)
})