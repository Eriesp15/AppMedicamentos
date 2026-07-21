// Buffer in-memory con tamaño acotado para no crecer sin límite. Si la app
// crece y necesitamos persistencia real, mover a Firestore/Mongo/etc.

const MAX_LOGS = 500;

/** @type {Array<{id:string,receivedAt:string,payload:object}>} */
const logs = [];

function appendLog(payload) {
  const id = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  logs.push({
    id,
    receivedAt: new Date().toISOString(),
    payload,
  });
  if (logs.length > MAX_LOGS) {
    logs.splice(0, logs.length - MAX_LOGS);
  }
  return id;
}

function listLogs({limit = 100} = {}) {
  return logs.slice(-limit).reverse();
}

function clearLogs() {
  logs.length = 0;
}

module.exports = {appendLog, listLogs, clearLogs};
