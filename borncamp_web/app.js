const express = require('express');
const path = require('path');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const expressStatusMonitor = require('express-status-monitor');
const expressValidator = require('express-validator');
const chalk = require('chalk');


/**
 * Set up controller
 */
const quiz1Controller = require('./controllers/quiz1');


/**
 * Set up express
 */
const app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(logger('dev'));
app.use(expressValidator());

app.get('/', quiz1Controller.index);


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
    console.log('  Press CTRL-C to stop\n');
});

module.exports = app;