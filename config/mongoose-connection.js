const mongoose = require('mongoose');
const config = require('config')
const ownerModel = require('../models/owner-model');

const dbgr = require('debug')('development:mongoose');
mongoose
.connect(`${config.get("MONGODB_URI")}/LuxeLoom`)
.then(()=>{
    dbgr("Connected to MongoDB");
})
.catch((err)=>{
    dbgr("Error connecting to MongoDB", err);
});

module.exports = mongoose.connection;