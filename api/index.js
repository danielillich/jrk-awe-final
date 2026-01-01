const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In-memory storage (wird bei jedem Cold Start zurückgesetzt)
let appData = { participants: [] };

// API Endpoints
app.get('/api/data', (req, res) => {
    res.json(appData);
});

app.post('/api/checkin/:id', (req, res) => {
    try {
        const participantId = parseInt(req.params.id);
        const { status, user } = req.body;
        
        const participant = appData.participants.find(p => p.id === participantId);
        if (!participant) {
            return res.status(404).json({ success: false, message: 'Teilnehmer nicht gefunden' });
        }

        participant.status = status;
        const timestamp = new Date().toLocaleString('de-DE');
        
        participant.checkInTime = null;
        participant.checkOutTime = null;
        participant.ausflugsTime = null;
        participant.krankTime = null;
        
        switch(status) {
            case 'present': participant.checkInTime = timestamp; break;
            case 'absent': participant.checkOutTime = timestamp; break;
            case 'ausflug': participant.ausflugsTime = timestamp; break;
            case 'krank': participant.krankTime = timestamp; break;
        }

        res.json({ success: true, participant });
    } catch (error) {
        console.error('Check-in error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/participants', (req, res) => {
    try {
        const { participants, user } = req.body;
        appData.participants = participants || [];
        res.json({ success: true });
    } catch (error) {
        console.error('Save participants error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/upload', (req, res) => {
    try {
        const { participants, user, forceUpdate, timestamp } = req.body;
        appData.participants = participants || [];
        console.log(`Upload by ${user}: ${participants.length} participants`);
        res.json({ success: true, count: participants.length });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Export für Vercel
module.exports = app;
