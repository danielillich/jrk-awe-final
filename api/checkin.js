let participants = [];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { id, status, user } = req.body;
    const participantIndex = participants.findIndex(p => p.id === parseInt(id));
    
    if (participantIndex !== -1) {
      participants[participantIndex].status = status;
      const timestamp = new Date().toLocaleString('de-DE');
      
      switch(status) {
        case 'present': participants[participantIndex].checkInTime = timestamp; break;
        case 'absent': participants[participantIndex].checkOutTime = timestamp; break;
        case 'ausflug': participants[participantIndex].ausflugsTime = timestamp; break;
        case 'krank': participants[participantIndex].krankTime = timestamp; break;
      }
      
      return res.status(200).json({ success: true });
    }
    
    return res.status(404).json({ success: false, message: 'Teilnehmer nicht gefunden' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
