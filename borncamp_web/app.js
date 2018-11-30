const express = require('express');
const path = require('path');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const expressStatusMonitor = require('express-status-monitor');
const expressValidator = require('express-validator');
const chalk = require('chalk');
const flash = require('express-flash');


/**
 * Set up controller
 */
const quiz1Controller = require('./controllers/quiz1');
const landingController = require('./controllers/landingController');
const resumeController = require('./controllers/resumeController');
const slidesController = require('./controllers/slidesController');
const webglController = require('./controllers/webglController');


/**
 * Set up express
 */
const app = express();
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(logger('dev'));
app.use(expressValidator());

// allow it to see the public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', landingController.index);
app.get('/quiz1', quiz1Controller.index);
app.get('/resume', resumeController.index);
app.get('/slides', slidesController.index);
app.get('/slides/aboutme', slidesController.aboutme);
app.get('/webgl', webglController.shaders);

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

