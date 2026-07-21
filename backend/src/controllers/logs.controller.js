const {appendLog, listLogs} = require('../services/logs.service');

const ALLOWED_KINDS = new Set([
  'network',
  'firestore',
  'storage',
  'api',
  'auth',
  'permission',
  'unknown',
]);
const ALLOWED_SEVERITIES = new Set(['toast', 'alert', 'silent']);
const MAX_TITLE_LEN = 200;
const MAX_MESSAGE_LEN = 500;
const MAX_RAW_MESSAGE_LEN = 1000;
const MAX_EXTRA_KEYS = 25;
const MAX_EXTRA_VALUE_LEN = 200;
const MAX_BODY_BYTES = 8 * 1024;

function truncate(value, max) {
  if (typeof value !== 'string') return value;
  if (value.length <= max) return value;
  return value.slice(0, max);
}

function sanitizeExtra(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const entries = Object.entries(raw).slice(0, MAX_EXTRA_KEYS);
  const out = {};
  for (const [key, value] of entries) {
    out[key] =
      typeof value === 'string'
        ? truncate(value, MAX_EXTRA_VALUE_LEN)
        : value;
  }
  return out;
}

function receiveLog(req, res) {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({message: 'INVALID_PAYLOAD'});
  }
  if (body.kind && !ALLOWED_KINDS.has(body.kind)) {
    return res.status(400).json({message: 'INVALID_KIND'});
  }
  if (body.severity && !ALLOWED_SEVERITIES.has(body.severity)) {
    return res.status(400).json({message: 'INVALID_SEVERITY'});
  }
  // Express body-parser ya tiene un límite por defecto pero algunos setups
  // lo relajan; defendernos en profundidad.
  const rawSize = JSON.stringify(body).length;
  if (rawSize > MAX_BODY_BYTES) {
    return res.status(413).json({message: 'PAYLOAD_TOO_LARGE'});
  }

  const id = appendLog({
    kind: body.kind || 'unknown',
    severity: body.severity || 'toast',
    title: truncate(body.title, MAX_TITLE_LEN) || null,
    message: truncate(body.message, MAX_MESSAGE_LEN) || null,
    source: body.source || 'unknown',
    context: body.context || null,
    extra: sanitizeExtra(body.extra),
    userAgent: req.headers['user-agent'] || null,
    timestamp: body.timestamp || new Date().toISOString(),
    rawMessage: truncate(body.rawMessage, MAX_RAW_MESSAGE_LEN) || null,
  });

  return res.status(202).json({id});
}

function getLogs(req, res) {
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 100, 1),
    500,
  );
  return res.status(200).json({count: listLogs({limit}).length, logs: listLogs({limit})});
}

module.exports = {receiveLog, getLogs};
