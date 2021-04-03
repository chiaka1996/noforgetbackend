const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cronJob = require("./controllers/cronJob");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});
const connection = mongoose.connection;
connection.once('open',(res) => {
    console.log("MongoDB connected");
});

const api = require('./routers/AllRouters.js');

app.use('/apis', api );

cron.schedule("01 * * * * *", () => {
    console.log("cron is working")
    cronJob.cronJobs();
});

 const server = http.createServer(app);
server.listen(port);