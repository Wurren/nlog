

var  passport       = require('koa-passport'),
     User           = require('../models/user'),
     Token          = require('../models/token'),
     Moment         = require('moment');



/*
|--------------------------------------------------------------------------
| Local
|--------------------------------------------------------------------------
*/

exports.local = function *() {
     yield this.render('login.liquid', { error: this.flash.error });
}

/*
|--------------------------------------------------------------------------
| Login Auth
|--------------------------------------------------------------------------
*/

exports.login = function *(next) {
     var ctx = this
     yield passport.authenticate('local', function*(err, user, info) {
          if (err) throw err
          if (user === false) {
               ctx.flash = { error: 'Wrong Email/Password Bruh' };
               ctx.redirect('/login');
          } else {
               yield ctx.login(user)
               ctx.redirect('/admin');
          }
     }).call(this, next);
} 


/*
|--------------------------------------------------------------------------
| Forgotten Password Index
|--------------------------------------------------------------------------
*/

exports.forgottenIndex = function *() {
     yield this.render('forgotten/index', { errors: this.flash.errors });
}


/*
|--------------------------------------------------------------------------
| Forgotten Password Post
|--------------------------------------------------------------------------
*/

exports.forgottenPost = function *() {

     var email = this.request.body.email;

     if ( email.length <= 0 ) {
          this.flash = { errors: [{ message: 'Please enter a valid email!' }] };
          return this.redirect('/forgotten');
     }

     var user = yield User.findOne({ email : email }).exec();

     if( !user ) {
          this.flash = { errors: [{ message: 'This account does not exist, sorry!' }] };
          return this.redirect('/forgotten');
     }

     yield Token.create({
          type: 'forgotten',
          user: user._id
     });

     yield this.render('forgotten/index', { message: 'A reset password email is on the way!' });

}



/*
|--------------------------------------------------------------------------
| Forgotten Password Reset Index
|--------------------------------------------------------------------------
*/

exports.forgottenResetIndex = function *() {

     if( !this.params.token.match(/^[0-9a-fA-F]{24}$/) ) {
          return yield this.render('forgotten/reset', { alive: false });
     }

     var token = yield Token.findById(this.params.token).populate('user').exec();

     if(!token) {
          return yield this.render('forgotten/reset', { alive: false });
     }

     if (Moment(token.created_at).add('m', 30).isBefore(Moment())) {
          return yield this.render('forgotten/reset', { alive: false });
     }

     yield this.render('forgotten/reset', { alive: true, token: token, error: this.flash.error });
     
}    



/*
|--------------------------------------------------------------------------
| Forgotten Password Reset Post
|--------------------------------------------------------------------------
*/

exports.forgottenReset = function *() {
     
     var token = yield Token.findById(this.params.token).populate('user').exec();

     if ( token == null ) {
          this.flash = { error: 'Something went wrong. Please try again.' };
          return this.redirect('/forgotten/reset/' + token._id);
     }

     if ( this.request.body.password.length <= 0 ) {
          this.flash = { error: 'You must enter a password' };
          return this.redirect('/forgotten/reset/' + token._id);
     }

     if ( this.request.body.password !== this.request.body.confirm ) {
          this.flash = { error: 'Passwords Dont match!' };
          return this.redirect('/forgotten/reset/' + token._id);
     }

     token.user.password = this.request.body.password;

     try {
          yield token.user.persist();
          token.remove();
          this.redirect('/login');
     }

     catch( error ) {
          this.flash = { error: 'Something went wrong. Please try again.' };
          return this.redirect('/forgotten/reset/' + token._id);
     }

}



/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

exports.logout = function *() {
     this.logout();
     this.redirect('/');
}


/*
|--------------------------------------------------------------------------
| Auther
|--------------------------------------------------------------------------
*/

exports.isAuthed = function *(next) {
     if (this.isAuthenticated()) {
          yield next
     } else {
          this.redirect('/login')
     }
}

