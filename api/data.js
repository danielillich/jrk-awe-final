// Initialize global storage once
if (!global.appParticipants) {
  global.appParticipants = [];
  console.log('Global storage initialized');
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    console.log('GET /api/data - returning:', global.appParticipants.length, 'participants');
    return res.status(200).json(global.appParticipants);
  }

  if (req.method === 'POST') {
    const { participants: newParticipants } = req.body;
    if (newParticipants && Array.isArray(newParticipants)) {
      global.appParticipants = newParticipants;
      console.log('POST /api/data - stored:', newParticipants.length, 'participants');
      return res.status(200).json({ success: true, count: global.appParticipants.length });
    }
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
