const express = require("express");
const router = express.Router();
const collection = require("./schema");
const owner = require('./OwnerSchema')
const mongoose = require("mongoose");


//Terminal suggesion
mongoose.set("strictQuery", false);

mongoose.connect("mongodb://127.0.0.1:27017/BikeService", (err, db) => {

    var Database = db
    if (err) throw err;
    console.log('DB Connection Success');

    //Admin/Owner 
    router.get('/owner', async (req, res) => {
        let data = await Database.collection('owner').findOne()
        res.json(data)
    })

    // Add new customers
    router.get('/newcus', async (request, response) => {
        let data = request.query
        await Database.collection('cus').insertOne({ email: data.getMail, mobno: data.getMobno })
        await response.json(data)
    })
    // Get Customer list for Admon/Owner page
    router.get('/customerList', async (request, response) => {
        let customerList = []
        let dbData = await Database.collection('cus').find().toArray()
        dbData.forEach(element => {
            customerList.push(element.email)
        })
        await response.json(customerList)

    })
    // Add services 
    router.post('/previesbooking', async (request, response) => {
        let email = request.body.id
        let data = request.body.data

        await Database.collection('currentServices').insertOne({ email, data, Status: "Booked" })
        await Database.collection('cus').updateOne({ email: email }, { $push: { oldService: data } })
        let returns = await Database.collection('cus').findOne({ email: email })
        let oldServices = returns.oldService
        await response.json(oldServices)

    })
    // Every customers can see our previews booking status
    router.post('/entered', async (request, response) => {
        let email = request.body.data
        let returns = await Database.collection('cus').findOne({ email: email })
        let oldServices = returns.oldService
        await response.json(oldServices)
    })


    // Admin/Owner can see the current servies 
    router.post('/currentServices', async (req, res) => {
        let currentServices = await Database.collection('currentServices').find().toArray()
        await res.json(currentServices)
    })
    //Update Status

    router.post('/updateStatus', async (req, res) => {
        let email = req.body.email
        let Status = req.body.Status
        if (Status === 'Booked' || Status === 'ready') {

            await Database.collection('currentServices').updateOne({ email: email }, { $set: { Status: Status } })
            let currentServices = await Database.collection('currentServices').find().toArray()
            await res.json(currentServices)
        }
        else if (Status === 'complete') {
            await Database.collection('currentServices').deleteOne({ email: email })
            let currentServices = await Database.collection('currentServices').find().toArray()
            await res.json(currentServices)

        }
    })

})
module.exports = router