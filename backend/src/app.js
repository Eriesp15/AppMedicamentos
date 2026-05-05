const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {env} = require('./config/env');
const {apiRouter} = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/', (_req, res) => {
  res.json({
    app: 'AppMedicamentos API',
    version: '0.1.0',
    docs: `${env.apiPrefix}/health`,
  });
});

app.use(env.apiPrefix, apiRouter);

module.exports = {app};
