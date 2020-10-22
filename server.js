'use strict';

// express is a nodejs web server
// https://www.npmjs.com/package/express
const express = require('express');

// converts content in the request into parameter req.body
// https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');

const db = require('./services/database.service');

// create the server
const app = express();

// the backend server will parse json, not a form request
app.use(bodyParser.json());

// health endpoint - returns an empty array
app.get('/', (req, res) => {
    res.json([]);
});

// version endpoint to provide easy convient method to demonstrating tests pass/fail
app.get('/version', (req, res) => {
    res.json({ version: '1.0.0' });
});


// mock events endpoint. this would be replaced by a call to a datastore
// if you went on to develop this as a real application.
app.get('/events', async (req, res) => {
    const events = await db.getEvents();
    res.json(events );
});

// Adds an event - in a real solution, this would insert into a cloud datastore.
// Currently this simply adds an event to the mock array in memory
// this will produce unexpected behavior in a stateless kubernetes cluster. 
app.post('/event', async (req, res) => {
    const events = await db.addEvent(req.body);
    // return all events
    res.status(201).json(events);
});

app.put('/event/:id', async (req, res) => {
    const events = await db.updateEvent(req.params.id, req.body);
    res.json(events);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

const PORT = 8082;
const server = app.listen(PORT, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Events app listening at http://${host}:${port}`);
});

module.exports = app;