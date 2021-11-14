const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 5000

//middleWare

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log("listening From", port)
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywgrf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
 async function run(){
    try{
        await client.connect()
         const database = client.db('baby-spoon')
         const productsCollection = database.collection("products")

         //POST API
        app.post('/products', async(req, res)=>{
          const products = req.body;
          const result = await productsCollection.insertOne(products);
          res.json(result);
        });

        //GET API
        app.get('/products', async(req, res) =>{
          const cursor = productsCollection.find({});
          const products = await cursor.toArray();
          res.send(products)
        });

        //GET Single Producyt API
        app.get('/products/:id', async(req, res)=>{
          const id = req.params.id;
          const query ={_id:ObjectId(id)};
          const product = await productsCollection.findOne(query);
          res.json(product);
        });

        //Delete API
        app.delete('/products/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await productsCollection.deleteOne(query);
          res.json(result);
        })
    }
    finally{

    }
 }
 run().catch(console.dir)