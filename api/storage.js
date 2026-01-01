// Global shared storage
global.sharedParticipants = global.sharedParticipants || [];

module.exports = {
  get: () => global.sharedParticipants,
  set: (participants) => {
    global.sharedParticipants = participants;
    console.log('Participants stored:', participants.length);
  },
  update: (id, updates) => {
    const index = global.sharedParticipants.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      Object.assign(global.sharedParticipants[index], updates);
      console.log('Participant updated:', id);
      return global.sharedParticipants[index];
    }
    return null;
  }
};
