const express = require('express');
const bodyparser = require('body-parser')
const request = require('request')
const app = express().use(bodyparser.json())

const apiRoutes = require('./Routes/api')

app.use(apiRoutes);


app.listen(process.env.PORT || 1337)