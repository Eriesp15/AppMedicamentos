function getHealthStatus() {
  return {
    status: 'ok',
    service: 'appmedicamentos-backend',
    timestamp: new Date().toISOString(),
  };
}

module.exports = {getHealthStatus};
