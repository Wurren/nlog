
var  passport       = require('koa-passport'),
     LocalStrategy  = require('passport-local').Strategy,
     User           = require('../models/user'),
     co             = require('co');

/*
|--------------------------------------------------------------------------
| Local
|--------------------------------------------------------------------------
*/

module.exports = function(passport, User) {
     passport.use(new LocalStrategy({
          usernameField: "email",
          passwordField: "password"
     },
     function (email, password, done) {

          return co(function* () {

               var user = yield User.findOne({ email: email })
               return user;

          }).then(function (user) {

               if (!user) return done(null, false, { message: 'Incorrect email.' });

               if (!user.authenticate(password)) {
                    return done(null, false, {
                         message: 'Invalid password'
                    });
               }

               return done(null, user);

          }, function (err) {

               if (err) return done(err); 

          });

     }));
}



