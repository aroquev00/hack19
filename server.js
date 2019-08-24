// server.js

const express = require('express');
const app = express();

const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

const path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

