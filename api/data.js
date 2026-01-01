const storage = require('./storage');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const participants = storage.get();
    console.log('GET /api/data - returning:', participants.length, 'participants');
    return res.status(200).json(participants);
  }

  if (req.method === 'POST') {
    const { participants: newParticipants } = req.body;
    if (newParticipants) {
      storage.set(newParticipants);
      console.log('POST /api/data - stored:', newParticipants.length, 'participants');
    }
    return res.status(200).json({ success: true, count: storage.get().length });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
