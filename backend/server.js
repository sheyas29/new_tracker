const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Use CORS middleware
app.use(cors());

app.get('/api/activities', (req, res) => {
    const dataPath = path.join(__dirname, 'activities.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading data');
            return;
        }
        const activities = JSON.parse(data);
        res.json(activities);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
