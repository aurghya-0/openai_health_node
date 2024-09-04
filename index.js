// Import necessary modules and initialize the database
import express from 'express';
import { getDepartmentSuggestion } from './departmentSuggestion.js';
import dotenv from 'dotenv';
import { initializeDb, openDb } from './database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize the database
// initializeDb();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the public folder
app.use(express.static('public'));

// Middleware to parse JSON request bodies
app.use(express.json());

// Render the main page
app.get('/', (req, res) => {
    res.render('index');
});

// Handle the department suggestion API request
app.post('/suggest-department', async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).json({ error: 'userMessage is required' });
    }

    try {
        const departmentSuggestion = await getDepartmentSuggestion(userMessage);
        res.json(departmentSuggestion);
    } catch (error) {
        console.error("Error getting department suggestion:", error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// New route to display list of patients
app.get('/patients', async (req, res) => {
    try {
        const db = await openDb();
        const patients = await db.all(`SELECT * FROM patients`);
        res.render('patients', { patients });
    } catch (error) {
        console.error("Error retrieving patients:", error);
        res.status(500).json({ error: 'An error occurred while retrieving the patient list' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
