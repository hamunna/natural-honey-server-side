const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
	res.send('Hello Doctors Portal!')
})

app.listen(port, () => {
	console.log(`Listening the port: ${port}`)
})