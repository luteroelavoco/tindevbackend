require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const routes = require('./routes');

const server = express();


mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.vwan4.mongodb.net/ommnistack8?retryWrites=true&w=majority`,{
    useNewUrlParser: true
})

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(3333);