const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const axios = require('axios');

const wapi = "";
let city;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/wapp.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('wdata', async function(data) {
        city = data;
        try {
            const ApiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=" + wapi;
            const response = await axios.get(ApiUrl);
            console.log(response.data);
            socket.emit('data', response.data); // Assuming you want to send the data from the response
        } catch (err) {
            socket.emit('error', "Something went wrong");
        }
    });

    socket.on('disconnect', function() {
        console.log('a user disconnected');
    })
});

http.listen(8098, function() {
    console.log('listening on *:3000');
});
