process.setMaxListeners(0); 
/*
|--------------------------------------------------------------------------
| Dependencies
|--------------------------------------------------------------------------
*/

var  koa            = require('koa'),
     bodyParser     = require('koa-bodyparser'),
     session        = require('koa-session'),
     flash          = require('koa-flash'),
     passport       = require('koa-passport'),
     router         = require('koa-router'),
     render         = require('koajs-nunjucks'),
     path           = require('path'),
     Mongorito      = require('mongorito'),
     _              = require('lodash'),
     app            = koa();



var renderer = render('./app/views', {
     autoescape: true,
     watch: true
})


/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

var Config = require('./app/config');

app.use(bodyParser());
app.keys = [Config.sessionKey];
app.use(session(app));
app.use(passport.initialize());
app.use(passport.session());
app.use(renderer);
app.use(flash());
app.use(router(app));


/*
|--------------------------------------------------------------------------
| Template Engine
|--------------------------------------------------------------------------
*/

// render(app, {
//      root:          path.join(__dirname, 'app/views'),
//      autoescape:    true,
//      cache:         Config.cacheViews,
//      ext:           'liquid'
// });




/*
|--------------------------------------------------------------------------
| Init Auth
|--------------------------------------------------------------------------
*/

var User = require('./app/models/user');

var auth = require('./app/auth/local')(passport, User);

var co = require('co');

passport.serializeUser(function(user, done) {
     done(null, user.get('_id'));
});

passport.deserializeUser(function(id, done) {

     co(function* () {
          try {
               var user = yield User.findById(id);
               done(null, user);
          }
          catch(err) {
               done(err, null)  
          }
     })

});


/*
|--------------------------------------------------------------------------
| Load Routes
|--------------------------------------------------------------------------
*/

var routes = require('./app/routes.js')(app);


/*
|--------------------------------------------------------------------------
| Get DB
|--------------------------------------------------------------------------
*/

Mongorito.connect(Config.database);


/*
|--------------------------------------------------------------------------
| Listen to that server purr...
|--------------------------------------------------------------------------
*/

app.listen(3000, function() {
     console.log('Running...');
});


