require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MessagingResponse } = require('twilio').twiml;
const connectDB = require('./db');

connectDB();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Helper functions
// --- Build this helper function when we decide on the data base ---
function handleAddTask(from, incomingMsg, twiml) {
}
// --- Build this helper function when we decide on the data base ---
function handleDeleteTask(from, incomingMsg, twiml) {
}

// Handle incoming messages
app.post('/whatsapp', (req, res) => {
    const incomingMsg = req.body.Body.toLowerCase();
    const from = req.body.From;
    const twiml = new MessagingResponse();

    const greetings = ['hi', 'hello', '?', 'hola', 'hey']
    const addTask = ['add', 'add task', '!', 'new', 'new task', 'create']
    const deleteTask = ['delete', 'delete task', 'del', 'remove']

    if (greetings.includes(incomingMsg)) { // Greeting
        twiml.message('Hello! How can I assist you today?');
    } else if(addTask.includes(incomingMsg)){ // Add task
        handleAddTask(from, incomingMsg, twiml);
    } else if(deleteTask.includes(incomingMsg)){ // Delete task
        // --- TO DO ---
        twiml.message("TO DO THIS FUNCTION LATER");
    }else {
        twiml.message("Sorry, I didn't understand that. Please try again.");
    }
    console.log(incomingMsg)

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
