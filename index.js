const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tutorsDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Tutor schema
const tutorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String, // Add password field
    subject: String,
    qualification: String
});

// Create a Tutor model
const Tutor = mongoose.model('Tutor', tutorSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define route handler for the welcome page ("/")
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/welcome.html'); // Serve welcome.html as the root page
});

// Define route handler for the tutor registration form ("/register_tutor")
app.post('/register_tutor', async (req, res) => {
    try {
        // Check if the user is already registered
        const existingTutor = await Tutor.findOne({ email: req.body.email });
        if (existingTutor) {
            // If the user is already registered, display a message
            return res.send("User is already registered. <a href='/login.html'>Login</a> instead.");
        }

        // If the user is not already registered, create a new tutor instance
        const newTutor = new Tutor({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // Store the password
            subject: req.body.subject,
            qualification: req.body.qualification
        });

        // Save the new tutor to the database
        await newTutor.save();
        console.log("Tutor data saved successfully.");
        // Redirect to the login page
        res.redirect('/tutor_home.html');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving tutor data.");
    }
});

// Define route handler for the login form ("/login")
// Define route handler for the login form ("/login")
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find the tutor with the provided email and password
        const tutor = await Tutor.findOne({ email, password });
        
        if (tutor) {
            // If tutor found, redirect to the tutor home page
            res.redirect('/tutor_home.html');
        } else {
            // If tutor not found, redirect to login page again or display an error message
            res.redirect('/login.html');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging in.");
    }
});

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
// Validate YouTube link format
function isValidYouTubeLink(link) {
    // Regular expression to match YouTube video IDs
    const youtubeRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    return link.match(youtubeRegex); // The error seems to be occurring here
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
// Define route handler for fetching courses
app.get('/courses', async (req, res) => {
    try {
        // Retrieve courses from the database
        const courses = await Course.find({});
        res.json(courses); // Send courses as JSON response
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).send('Error fetching courses');
    }
});

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    grade: String,
    school: String
});

// Create a Student model
const Student = mongoose.model('Student', studentSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Define route handler for the welcome page ("/")
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/welcome.html'); // Serve welcome.html as the root page
});

// Define route handler for the student registration form ("/register_student")
app.post('/register_student', async (req, res) => {
    try {
        // Check if the student is already registered
        const existingStudent = await Student.findOne({ email: req.body.email });
        if (existingStudent) {
            // If the student is already registered, display a message
            return res.send("Student is already registered. <a href='/login.html'>Login</a> instead.");
        }

        // If the student is not already registered, create a new student instance
        const newStudent = new Student({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            grade: req.body.grade,
            school: req.body.school
        });

        // Save the new student to the database
        await newStudent.save();
        console.log("Student data saved successfully.");
        // Redirect to the login page
        res.redirect('/login.html');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving student data.");
    }
});

// Define route handler for the login form ("/login")
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find the student with the provided email and password
        const student = await Student.findOne({ email, password });
        
        if (student) {
            // If student found, redirect to the student home page
            res.redirect('/student_home.html');
        } else {
            // If student not found, redirect to login page again or display an error message
            res.redirect('/login.html');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging in.");
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

