const storage = require('./storage');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { id, status, user } = req.body;
    
    const timestamp = new Date().toLocaleString('de-DE');
    const updates = { status };
    
    // Clear all timestamps
    updates.checkInTime = null;
    updates.checkOutTime = null;
    updates.ausflugsTime = null;
    updates.krankTime = null;
    
    // Set appropriate timestamp
    switch(status) {
      case 'present': updates.checkInTime = timestamp; break;
      case 'absent': updates.checkOutTime = timestamp; break;
      case 'ausflug': updates.ausflugsTime = timestamp; break;
      case 'krank': updates.krankTime = timestamp; break;
    }
    
    const updated = storage.update(id, updates);
    
    if (updated) {
      console.log(`Status update by ${user}: Participant ${id} -> ${status}`);
      return res.status(200).json({ success: true, participant: updated });
    }
    
    return res.status(404).json({ success: false, message: 'Teilnehmer nicht gefunden' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
