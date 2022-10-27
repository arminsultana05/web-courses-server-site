const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const {  ObjectId } = require('bson');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stwaq9t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const courseCollection = client.db('web-courses').collection('courses')
        const userCollections = client.db('web-courses').collection('users');

        //Get all data method
        app.get('/course', async (req, res) => {
            const query = {};
            const cursor = courseCollection.find(query);
            const courses = await cursor.toArray();
            res.send(courses)

        });

        // Load single data by id
        app.get('/course/:id', async(req, res)=>{
            const id =req.params.id;
            const query ={_id: ObjectId(id)};
            const course =await courseCollection.findOne(query);
            res.send(course)
        }) 
        
        //Save all user in database by email
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
      
            const filter = { email: email };
            const option = { upsert: true };
            const updateDoc = {
              $set: user,
            };
            const result = await userCollections.updateOne(filter, updateDoc, option)
            res.send(result)
          });

          //get all user..
          app.get('/users', async (req, res) => {
            const user = await userCollections.find().toArray();
            res.send(user)
          })
      

    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('running server');
})
app.listen(port, () => {
    console.log('Listening to port', port);

})
