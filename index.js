const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xribv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
	try {
		await client.connect();
		const database = client.db('naturalHoneydb');
		const productsCollection = database.collection('products');

		// GET API
		app.get('/products', async (req, res) => {

			const cursor = productsCollection.find({});
			const products = await cursor.toArray();
			console.log(products);
			res.send(products);
		});

	}
	finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Hello Honey Bees!')
})

app.listen(port, () => {
	console.log(`Listening the port: ${port}`)
})