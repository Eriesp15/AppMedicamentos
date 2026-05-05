const {getHealthStatus} = require('../services/health.service');

function healthCheck(_req, res) {
  res.status(200).json(getHealthStatus());
}

module.exports = {healthCheck};
