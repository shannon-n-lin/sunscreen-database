const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 9000
const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config()

let dbConnectionStr = process.env.DB_CONNECTION_STRING,
    db, 
    collection

// middleware
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.json())
app.use(cors())

// MongoDB connection
MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(client => {
    console.log('Connected to database.')
    db = client.db('sunscreen-database')
    collection = db.collection('sunscreens')
  })
  .catch(error => console.error(error))

// load ejs template with list of sunscreens on root page
app.get('/', (req, res) => {
  collection.find().toArray()
  .then(data => {
    res.render('index.ejs', {info: data})
    console.log('Rendered index.ejs template.')
  })
  .catch(error => console.error(error))
})

// jquery autocomplete search of database
// uses MongoDB search index definition (see below)
app.get('/search', async (req, res) => {
  try {
    let result = await collection.aggregate([
      {
        $search: {
          compound: {
            should: [
              {
                autocomplete: {
                  query: `${req.query.query}`,
                  path: 'brand',
                  fuzzy: {
                    maxEdits: 2,
                    prefixLength: 3,
                  }
                }
              },
              {
                autocomplete: {
                  query: `${req.query.query}`,
                  path: 'name',
                  fuzzy: {
                    maxEdits: 2,
                    prefixLength: 3,
                  }
                }
              }
            ]
          }
        }
      }
    ]).toArray()
    res.send(result)
  } catch(error) {
    res.status(500).send({message: error.message})
  }
})

// load selected autocomplete search result
app.get('/get/:id', async (req, res) => {
  try {
    let result = await collection.findOne({
      '_id': ObjectId(req.params.id)
    })
    res.send(result)
  } catch(error) {
    res.status(500).send({message: error.message})
  }
})

// manual search of database
app.get('/api/:search', (req, res) => {
  const search = req.params.search.toLowerCase()
  collection.find(
    // uses MongoDB search index definition (see below)
    {'$text': {'$search': search}}
  ).toArray()
  .then(results => {
    console.log(results)
    res.json(results[0])
  })
  .catch(error => console.error(error))
})

// add sunscreen to database
app.post('/addSunscreen', (req, res) => {
  collection.insertOne({
    brand: req.body.brand,
    name: req.body.name,
    spf: req.body.spf,
    form: req.body.form,
    type: req.body.type,
    finish: req.body.finish,
    ounces: req.body.ounces,
    priceUSD: req.body.priceUSD,
    ingredients: req.body.ingredients,
    imageURL: req.body.imageURL,
    likes: 0,
  })
  .then(result => {
    console.log('Sunscreen added')
    res.redirect('/')
  })
  .catch(error => console.error(error))
})

// add one like to a sunscreen
app.put('/addLike', (req, res) => {
  collection.updateOne({name: req.body.name}, 
  {
    $set: {likes: req.body.likes + 1}
  })
  .then(result => {
    console.log(`Added one like to ${req.body.name}`)
    res.json(`Added one like to ${req.body.name}`)
  })
  .catch(error => console.error(error))
})

// delete a sunscreen
app.delete('/deleteSunscreen', (req, res) => {
  collection.deleteOne({name: req.body.name})
  .then(result => {
    console.log(`${req.body.name} deleted`)
    res.json(`${req.body.name} deleted`)
  })
  .catch(error => console.error(error))
})

// connect to port in hosting environment or localhost
app.listen(process.env.PORT || PORT, () => {
  console.log(`The server is running.`)
})


/* --------------------------------------------------
MongoDB search index definition:
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "brand": {
        "foldDiacritics": true,
        "maxGrams": 7,
        "minGrams": 3,
        "tokenization": "edgeGram",
        "type": "autocomplete"
      },
      "name": {
        "foldDiacritics": true,
        "maxGrams": 7,
        "minGrams": 3,
        "tokenization": "edgeGram",
        "type": "autocomplete"
      }
    }
  }
}
-------------------------------------------------- */