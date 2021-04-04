'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const { sequelize } = require('./models/index');
const routes = require('./routes');
const asyncHandler = require('./middleware/async-handler');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Parsing incoming data to JSON
app.use(express.json());

// Authenticate connection to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been successfully established.');
  })
  .catch(err => {
    console.log('Connection to the database failed: ', err);
  });

// Use the 'routes.js' router to handle requests to '/api' 
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', asyncHandler(async (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
}));

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
    stack: err.stack,
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
