// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create an Express app
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/coursesDB', { useNewUrlParser: true, useUnifiedTopology: true });

.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Define a schema for the Course model
const courseSchema = new mongoose.Schema({
    title: String,
    description: String,
    level: String,
    price: Number,
    videoLink: String,
    assignmentLink: String
});

// Create a Course model
const Course = mongoose.model('course', courseSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Validate YouTube link format
function isValidYouTubeLink(link) {
    // Regular expression to match YouTube video IDs
    const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    return link.match(youtubeRegex);
}

// Validate Google Drive link format
function isValidGoogleDriveLink(link) {
    // Regular expression to match Google Drive file IDs
    const driveRegex = /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-_]+)/;
    return link.match(driveRegex);
}

// Define route handler for the course upload form ("/upload-course")
app.post('/upload-course', async (req, res) => {
    try {
        // Extract course details from the request body
        const { title, description, level, price, videoLink, assignmentLink } = req.body;

        // Validate YouTube and Google Drive links
        if (!isValidYouTubeLink(videoLink) && !isValidGoogleDriveLink(assignmentLink)) {
            throw new Error('Invalid video or assignment link');
        }

        // Create a new course instance
        const newCourse = new Course({
            title,
            description,
            level,
            price,
            videoLink,
            assignmentLink
        });

        // Save the new course to the database
        await newCourse.save();

        // Redirect to the home page or any other page after successful upload
        res.redirect('/tutor_home.html');
    } catch (error) {
        console.error('Error uploading course:', error);
        res.status(500).send('Error uploading course');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
