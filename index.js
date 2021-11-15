const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
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
		const allOrdersCollection = database.collection("allOrders");
		const reviewsCollection = database.collection("reviews");
		const usersCollection = database.collection("users");


		//==========================================================================
		// GET API
		//==========================================================================
		// GET API
		app.get('/products', async (req, res) => {

			const cursor = productsCollection.find({});
			const products = await cursor.toArray();
			res.json(products);
		});

		
		// GET API All Orders Collection
		app.get('/allOrders/list', async (req, res) => {

			const list = req.query.list;
			const query = { list: list }
			const cursor = allOrdersCollection.find(query);
			const orders = await cursor.toArray();
			res.json(orders);
		});

		// GET API Orders Collection by Email
		app.get('/allOrders', async (req, res) => {
			const email = req.query.userEmail;
			const query = { userEmail: email }
			const cursor = allOrdersCollection.find(query);
			const orders = await cursor.toArray();
			res.json(orders);
		});

		// GET API Reviews Collection
		app.get('/reviews', async (req, res) => {

			const cursor = reviewsCollection.find({});
			const reviews = await cursor.toArray();
			res.json(reviews);
		});

		// GET API Checking isAdmin
		app.get('/users/:email', async (req, res) => {
			const email = req.params.email;
			const query = { email: email };
			const user = await usersCollection.findOne(query);
			let isAdmin = false;
			if (user?.role === 'admin') {
				isAdmin = true;
			}
			res.json({ admin: isAdmin });
		});


		//==========================================================================
		// POST API
		//==========================================================================
		// POST API All Orders Collection
		app.post('/allOrders', async (req, res) => {
			const newOrder = req.body;
			const result = await allOrdersCollection.insertOne(newOrder);

			res.json(result);
		});

		// POST API Reviews Collection
		app.post('/reviews', async (req, res) => {
			const newReview = req.body;
			const result = await reviewsCollection.insertOne(newReview);

			res.json(result);
		});

		// POST API Products Collection
		app.post('/products', async (req, res) => {
			const newProduct = req.body;
			const result = await productsCollection.insertOne(newProduct);

			res.json(result);
		});

		// POST API Users Collection
		app.post('/users', async (req, res) => {
			const newUser = req.body;
			const result = await usersCollection.insertOne(newUser);

			res.json(result);
		});


		//==========================================================================
		// PUT API
		//==========================================================================

		// PUT API upsert Users Collection
		app.put('/users', async (req, res) => {
			const user = req.body;
			const filter = { email: user.email };
			const options = { upsert: true };
			const updateDoc = { $set: user };
			const result = await usersCollection.updateOne(filter, updateDoc, options);
			res.json(result);
		});

		// PUT API Update User to an Admin
		app.put('/users/admin', async (req, res) => {
			const user = req.body;
			const filter = { email: user.email };
			const updateDoc = { $set: { role: 'admin' } };
			const result = await usersCollection.updateOne(filter, updateDoc);
			res.json(result);
		});

		// PUT API Update Order Pending to Complete 
		app.put('/allOrders/:id', async (req, res) => {
			const id = req.params.id;
			const updatedOrder = req.body;
			const filter = { _id: ObjectId(id) };
			// const options = { upsert: true };
			const updateDoc = { $set: { 
				status: 'Complete'
			}
			};
			const result = await allOrdersCollection.updateOne(filter, updateDoc);
			res.send(result);
		});


		//==========================================================================
		// DELETE API
		//==========================================================================
		// DELETE User (API)
		app.delete('/allOrders/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await allOrdersCollection.deleteOne(query);

			res.json(result);
		});

		// DELETE Product (API)
		app.delete('/products/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await productsCollection.deleteOne(query);

			res.json(result);
		});
	}
	finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get('/', (req, res) => {
	res.send('Honey Bee Server is running...');
})

app.listen(port, () => {
	console.log(`Listening the port: ${port}`)
})