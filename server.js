const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const userData = {};

app.get('/api/statuses/:userId', (req, res) => {
    const { userId } = req.params;
    if (!userData[userId]) {
        userData[userId] = {};
    }
    console.log(`GET /api/statuses/${userId} - Returning:`, userData[userId]);
    res.json(userData[userId]);
});

app.post('/api/statuses/:userId', (req, res) => {
    const { userId } = req.params;
    const { isoCode, status } = req.body;

    if (!isoCode || !status) {
        console.log(`POST /api/statuses/${userId} - Error: Missing ISO code or status`);
        return res.status(400).json({ error: 'ISO code and status are required' });
    }

    if (!userData[userId]) {
        userData[userId] = {};
    }

    if (userData[userId][isoCode]) {
        console.log(`POST /api/statuses/${userId} - Error: Country ${isoCode} already has status`);
        return res.status(409).json({ error: 'Country already has a status' });
    }

    if (!isoCode.match(/^[A-Z]{2}$/)) {
        console.log(`POST /api/statuses/${userId} - Error: Invalid ISO code ${isoCode}`);
        return res.status(400).json({ error: 'Invalid ISO code' });
    }

    userData[userId][isoCode] = status;
    console.log(`POST /api/statuses/${userId} - Added: ${isoCode} with status ${status}`);
    res.status(201).json({ message: 'Status added', isoCode, status });
});

app.put('/api/statuses/:userId/:isoCode', (req, res) => {
    const { userId, isoCode } = req.params;
    const { status } = req.body;

    if (!userData[userId] || !userData[userId][isoCode]) {
        console.log(`PUT /api/statuses/${userId}/${isoCode} - Error: Country status not found`);
        return res.status(404).json({ error: 'Country status not found' });
    }

    userData[userId][isoCode] = status;
    console.log(`PUT /api/statuses/${userId}/${isoCode} - Updated to status ${status}`);
    res.json({ message: 'Status updated', isoCode, status });
});

app.delete('/api/statuses/:userId/:isoCode', (req, res) => {
    const { userId, isoCode } = req.params;

    if (!userData[userId] || !userData[userId][isoCode]) {
        console.log(`DELETE /api/statuses/${userId}/${isoCode} - Error: Country status not found`);
        return res.status(404).json({ error: 'Country status not found' });
    }

    delete userData[userId][isoCode];
    console.log(`DELETE /api/statuses/${userId}/${isoCode} - Status removed`);
    res.json({ message: 'Status removed' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});