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
         const orderCollection = database.collection('orders')

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
        //Update API
        app.put('/products/:id', async(req, res)=>{
          const id = req.params.id;
          const updateProduct = req.body;
          const filter ={_id:ObjectId(id)};
          const option = {upset :true};
          const updateDoc ={
            $set:{
              name: updateProduct.name,
              desc: updateProduct.desc,
              price: updateProduct.price,
              img: updateProduct.img
            },
          };
          const result = await productsCollection.updateOne(filter, updateDoc, option);
          res.json(result);
        })

        //Delete API
        app.delete('/products/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await productsCollection.deleteOne(query);
          res.json(result);
        })
        //Order API
        app.post('/orders', async(req, res)=>{
          const order = req.body;
          const result = await orderCollection.insertOne(order);
          res.json(result)
        })
    }
    finally{

    }
 }
 run().catch(console.dir)