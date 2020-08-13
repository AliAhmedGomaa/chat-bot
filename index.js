const express = require('express')
const bodyparser = require('body-parser')
const request = require('request')
const app = express().use(bodyparser.json())


app.get('/',(req, res)=> {
    res.send("Hello")
})
// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "EAAEMidV7l9cBAMlMbsBb6aZB6LRFgSZBQJAzdpk9mSe2Q1oTG2B1Bqpwr26B6fhruwHZAQtCVZAdnYaacqCiSsBBVGGlfdrTHDrp0UEKOhlWA8jIrd4Qxp8ZBKTK4gHTBNmtLZBjwUBWxF2uag4UiX8kSIOqDwHbpsr2R2qCvnDQZDZD"

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', (req, res) => {

    let body = req.body;
    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(entry => {

            // Gets the message. entry.messaging is an array, but 
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];

            const msg = webhook_event.message.text
            const restricted = ['تبا لك', 'ثكلتك امك'];

            sentMsg = msg;
            restricted.forEach(message => {
                if (sentMsg == message) sentMsg = "شكرا لك"
            })

            const senderId = webhook_event.sender.id;
            request({
                url: "https://graph.facebook.com/v8.0/me/messages?access_token=EAAEMidV7l9cBAMlMbsBb6aZB6LRFgSZBQJAzdpk9mSe2Q1oTG2B1Bqpwr26B6fhruwHZAQtCVZAdnYaacqCiSsBBVGGlfdrTHDrp0UEKOhlWA8jIrd4Qxp8ZBKTK4gHTBNmtLZBjwUBWxF2uag4UiX8kSIOqDwHbpsr2R2qCvnDQZDZD",
                method: "POST",
                json: true,
                json: {
                    "recipient": {
                        "id": senderId
                    },
                    "message": {
                        "text": sentMsg
                    }
                }
            })


        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }



});

app.listen(process.env.PORT || 3000)