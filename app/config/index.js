/*
|--------------------------------------------------------------------------
| Config 
|--------------------------------------------------------------------------
*/

var  env = process.env.NODE_ENV || 'development',
     config;

if ( env === 'development' ) {
     config = require('./development.js');
} else {
     config = require('./production.js');
}

exports = module.exports = config;