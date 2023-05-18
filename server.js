const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 9000
const dotenv = require('dotenv').config()
const MongoClient = require('mongodb').MongoClient
const connectionString = `mongodb+srv://shannonnlin:${process.env.MONGODB_PASSWORD}@cluster1.yuwebwh.mongodb.net/?retryWrites=true&w=majority`

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

MongoClient.connect(connectionString, {useUnifiedTopology: true, useNewUrlParser: true})
  .then(client => {
    console.log('Connected to database')
    const db = client.db('sunscreen-database')
    const infoCollection = db.collection('sunscreens')
    
    app.get('/api/:query', (req, res) => {
      const query = req.params.query.toLowerCase()
      infoCollection.find({name: query}).toArray()
      .then(results => {
        console.log(results)
        res.json(results[0])
      })
      .catch(error => console.error(error))
    })
})
.catch (error => console.error(error))

app.listen(process.env.PORT || PORT, () => {
  console.log(`The server is running on port ${PORT}.`)
})