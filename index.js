const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

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
         const userCollection = database.collection('users')
         const reviewCollection = database.collection('reviews')

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
          console.log("order", order)
          const result = await orderCollection.insertOne(order);
          res.json(result)
        })

        //User API
        app.post('/users', async(req, res)=>{
          const user = req.body;
          const result = await userCollection.insertOne(user);
          res.json(result);
        })

        app.put('/users', async(req, res)=>{
          const user = req.body;
          const filter ={email:user.email};
          const options = {upsert : true};
          const updateDoc = {$set : user};
          const result = await userCollection.updateOne(filter, updateDoc, options);
          res.json(result);
        })

        app.put('/users/admin', async(req, res)=>{
          const user = req.body;
          console.log('put', user)
          const filter = {email: user.email};
          const updateDoc = {$set: {role:'admin'}};
          const result = await userCollection.updateOne(filter, updateDoc);
          res.json(result)
        })

          // Review POST API
          app.post('/review', async(req, res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
          });
  
          // Review GET API
          app.get('/review', async(req, res) =>{
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review)
          });
    }
    finally{

    }
 }
 run().catch(console.dir)