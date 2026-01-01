// Use the same global storage
if (!global.appParticipants) {
  global.appParticipants = [];
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { id, status, user } = req.body;
    
    const participantIndex = global.appParticipants.findIndex(p => p.id === parseInt(id));
    
    if (participantIndex === -1) {
      console.log('Participant not found:', id, 'Total participants:', global.appParticipants.length);
      return res.status(404).json({ success: false, message: 'Teilnehmer nicht gefunden' });
    }
    
    const timestamp = new Date().toLocaleString('de-DE');
    
    // Update participant
    global.appParticipants[participantIndex].status = status;
    global.appParticipants[participantIndex].checkInTime = null;
    global.appParticipants[participantIndex].checkOutTime = null;
    global.appParticipants[participantIndex].ausflugsTime = null;
    global.appParticipants[participantIndex].krankTime = null;
    
    // Set appropriate timestamp
    switch(status) {
      case 'present': 
        global.appParticipants[participantIndex].checkInTime = timestamp; 
        break;
      case 'absent': 
        global.appParticipants[participantIndex].checkOutTime = timestamp; 
        break;
      case 'ausflug': 
        global.appParticipants[participantIndex].ausflugsTime = timestamp; 
        break;
      case 'krank': 
        global.appParticipants[participantIndex].krankTime = timestamp; 
        break;
    }
    
    console.log(`Status update by ${user}: Participant ${id} -> ${status}`);
    return res.status(200).json({ 
      success: true, 
      participant: global.appParticipants[participantIndex] 
    });
  }

  return res.status(405).json({ message: 'Method not allowed' });
};
