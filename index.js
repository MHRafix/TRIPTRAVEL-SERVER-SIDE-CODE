const express = require('express');

// Import mongodb, cors, objectId, stripe and dotenv
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const fileUpload = require('express-fileupload');

// App and Port
const app = express();
const port = process.env.PORT || 5000;

// MidleWere
app.use(cors());
app.use(express.json());
app.use(fileUpload());


// Server to database connection uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ttpfp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


/********************************************
 * Node server crud operation start from here
 ********************************************/

async function run() {
    try {
        await client.connect();

        // Recognize the database and data collection
        const database = client.db('asiaAdvanture'); // Database name
        const packagesCollection = database.collection('travelPackages');
        const savedTripCollection = database.collection('SavedTrip');
        const resturantsCollection = database.collection('ResturantBranch');
        const cartedFoodsCollection = database.collection('FoodsCartList');
        const orderedFoodsCollection = database.collection('OrderedFoods');
        const hotelsCollection = database.collection('Hotels');
        const bookedTrip = database.collection('BookedTrip');
        const bookedHotel = database.collection('BookedHotel');
        

        /*******************
         * All Post Api Here
         * *****************/

        // Post Package API
        app.post('/tripPack', async(req, res) => {
            const image = req.files.thumbnail;
            const thumbnailData = image.data;
            const encodedThumb = thumbnailData.toString('base64');
            const thumbnailBuf = Buffer.from(encodedThumb, 'base64');
            const food = {
                infoData: req.body,
                thumbnail: thumbnailBuf
            };

            const result = await packagesCollection.insertOne(food);
            res.json(result);

        });

        // Save the package book latter list
        app.post('/savedTrip', async (req, res) => {
            const favTrip = req.body;
            const result = await savedTripCollection.insertOne(favTrip);
            res.json(result);
        });

        // Save the foods in the resturants branch data
        app.post('/addFoods', async (req, res) => {
            const image = req.files.thumbnail;
            const thumbnailData = image.data;
            const encodedThumb = thumbnailData.toString('base64');
            const thumbnailBuf = Buffer.from(encodedThumb, 'base64');
            const food = {
                infoData: req.body,
                thumbnail: thumbnailBuf
            };

            const result = await resturantsCollection.insertOne(food);
            res.json(result);
        });

        // Save the carted food data in the FoodCartList
        app.post('/foodsCartList', async (req, res) => {
            const cartedFood = req.body;
            const result = await cartedFoodsCollection.insertOne(cartedFood);
            res.json(result);
        });

        // Save the ordered food data in the order list
        app.post('/orderedFoods', async (req, res) => {
            const orderFood = req.body;
            const result = await orderedFoodsCollection.insertOne(orderFood);
            res.json(result);
        });
        
        // Save the posted hotel's data in the hotels list
        app.post('/hotels', async (req, res) => {
            const image = req.files.thumbnail;
            const thumbnailData = image.data;
            const encodedThumb = thumbnailData.toString('base64');
            const thumbnailBuf = Buffer.from(encodedThumb, 'base64');
            const hotel = {
                infoData: req.body,
                thumbnail: thumbnailBuf
            };
            
            const result = await hotelsCollection.insertOne(hotel);
            res.json(result);
        });
        
        
        
        // Save the trippack booking data to the trip booking list
        app.post('/bookTripP', async (req, res) => {
            const information = req.body;
            const result = await bookedTrip.insertOne(information);
            res.json(result);
        });

        // Save the hotel booking data to the hotel booking list
        app.post('/bookHotel', async (req, res) => {
            const information = req.body;
            const result = await bookedHotel.insertOne(information);
            res.json(result);
        });

        /*******************
         * All Get API Here
         * ******************/

        // Get the hotels data from the database using get api
        app.get('/allHotelBed', async (req, res) => {
            const findHotel = hotelsCollection.find({});
            const result = await findHotel.toArray();
            res.send(result);
        });

        // Get the packages data from the database using get api
        app.get('/tripPack', async (req, res) => {
            const findPackages = packagesCollection.find({});
            const packages = await findPackages.limit(6).toArray();
            res.send(packages);
        });
  
        // Get the packages data from the database using get api
        app.get('/allTripPack', async (req, res) => {
            const findPackages = packagesCollection.find({});
            const packages = await findPackages.toArray();
            res.send(packages);
        });
  

        // Get the booked packages data from the database using get api
        app.get('/myOrders', async (req, res) => {
            const bookedPackages = bookingCollection.find({});
            const bookedPackage = await bookedPackages.toArray();
            res.send(bookedPackage);
        });

        // Get saved trip data from the mongodb database
        app.get('/savedTrip', async (req, res) => {
            const findSavedTrip = savedTripCollection.find({});
            const trip = await findSavedTrip.toArray();
            res.send(trip);

        });

        // Get foods data from the mongodb database
        app.get('/foods', async (req, res) => {
            const findFoods = resturantsCollection.find({});
            const foods = await findFoods.limit(8).toArray();
            res.send(foods);
        });

        // Get foods data from the mongodb database
        app.get('/allFoods', async (req, res) => {
            const findFoods = resturantsCollection.find({});
            const foods = await findFoods.toArray();
            res.send(foods);
        });
       
        // Get carted foods data from the mongodb database
        app.get('/foodsCartList/:email', async (req, res) => {
            const query = {email: req.params.email};
            const findCartFoods = cartedFoodsCollection.find(query);
            const cartFood = await findCartFoods.toArray();
            res.send(cartFood);
        });

        // Get my booked trip from the mongodb database
        app.get('/myBookedTrips/:email', async (req, res) => {
            const query = {email: req.params.email};
            const findMyTrips = bookedTrip.find(query);
            const myTrip = await findMyTrips.toArray();
            res.send(myTrip);
        });

        // Get my booked trip from the mongodb database
        app.get('/myOrderedFoods/:email', async (req, res) => {
            const query = {email: req.params.email};
            const findMyFoods = orderedFoodsCollection.find(query);
            const myFood = await findMyFoods.toArray();
            res.send(myFood);
        });


         /*************
         * Update Api
         * ***********/
        // Update ordered foods from orderedfoodscollection
        app.put('/myOrderedFoods/:email/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set: {
                    payment: payment,
                    paymentStatus: true,
                    status: 'Approved'
                }
            };
            const result = await orderedFoodsCollection.updateOne(filter
                , updateDoc);
                res.json(result);
            });
            
            // Update booked trips from bookedTripscollection
            app.put('/myBookedTrips/:email/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set: {
                    payment: payment,
                    paymentStatus: true,
                    status: 'Approved'
                }
            };
            const result = await bookedTrip.updateOne(filter
                , updateDoc);
                res.json(result);
            });

            // Update booked hotel from bookedHotelscollection
            app.put('/allHotelBed/:email/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = {_id: ObjectId(id)};
            const updateDoc = {
                $set: {
                    payment: payment,
                    paymentStatus: true,
                    status: 'Approved'
                }
            };
            const result = await hotelsCollection.updateOne(filter
                , updateDoc);
                res.json(result);
            });
    
    
    


        /*********************************
         * All delete API operation here
         * *******************************/
        // Delete selected saved trip from the database
        app.delete('/savedTrip/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await savedTripCollection.deleteOne(query);
            res.json(result);
        });


        // Delete selected food from the database
        app.delete('/foodsCartList/:email/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await cartedFoodsCollection.deleteOne(query);
            res.json(result);
        });

        // Delete selected ordered foods from the database
        app.delete('/myOrderedFoods/:email/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await orderedFoodsCollection.deleteOne(query);
            res.json(result);
        });

        // Delete selected booked trip from the database
        app.delete('/myBookedTrips/:email/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id:ObjectId(id) };
            const result = await bookedTrip.deleteOne(query);
            res.json(result);
        });


        /**************************************
         Stripe payment method intrigate here 
        ***************************************/
        app.post("/create-payment-intent", async (req, res) => {
        const paymentInfo = req.body;
        const amount = paymentInfo.payableAmount * 100;
        const paymentIntent =  await stripe.paymentIntents.create({
            currency: "usd",
            amount: amount,
            payment_method_types: ['card']
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    
        });


    }

    finally {
        // await client.close();
    }

}

// Call the async function
run().catch(console.dir);


/****************************************
 * Node server crud operation end to here
 ****************************************/


// Check server is running or not
app.get('/', (req, res) => {
    res.send('Running trip travel limited server!');
});

// Listen server what we do here
app.listen(port, () => {
    console.log("Trip travel limited app listening.");
});