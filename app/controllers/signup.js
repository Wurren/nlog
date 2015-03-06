

var  User      = require('../models/user'),
     Errors    = require('../services/errors');

/*
|--------------------------------------------------------------------------
| Render Signup
|--------------------------------------------------------------------------
*/

exports.getIndex = function *() {
     yield this.render('signup.liquid', { 
          errors : this.flash.errors 
     });
}

/*
|--------------------------------------------------------------------------
| Render Signup
|--------------------------------------------------------------------------
*/

exports.postIndex = function *() {
     var params = this.request.body;
     try {
          var user = new User({
               email: params.email,
               password: params.password
          });
          yield user.save();
          this.redirect('/login');
     } 

     catch(errors) {
          this.flash =  { errors: Errors.convert(errors) };
          this.redirect('/signup');
     }
}
