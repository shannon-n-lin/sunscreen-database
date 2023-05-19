const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
let db, collection
require('dotenv').config()
const PORT = 9000

// middleware
app.use(cors())
app.use(express.static('public'))
app.use(express.json())

// MongoDB connection
MongoClient.connect(process.env.DB_CONNECTION_STRING, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(client => {
    console.log('Connected to database.')
    db = client.db('sunscreen-database')
    collection = db.collection('sunscreens')
  })
  .catch(error => console.error(error))

// root page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
  // collection.find().sort({likes: -1}).toArray()
  // .then(data => {
  //   res.render('index.ejs', {info: data})
  // })
  // .catch(error => console.error(error))
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

// manual search
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