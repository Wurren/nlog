


var Mongorito = require('mongorito'),
    Model     = Mongorito.Model,
    crypto    = require('crypto'),
    _         = require('lodash');


class User extends Model {

     configure() {
          this.before('create', 'validate');
          this.before('create', 'salt');
     }

     makeSalt() {
          return crypto.randomBytes(16).toString('base64');
     }

     authenticate(plainText) {
          return this.hashPassword(plainText) === this.get('password');
     }

     hashPassword(password) {
          if (!password || !this.get('salt')) return '';
          var salt = new Buffer(this.get('salt'), 'base64');
          return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
     }

     * salt(next) {
          this.set('salt', this.makeSalt());
          this.set('password', this.hashPassword(this.get('password')));
          yield next;
     }

     * validate(next) {
          var password = yield this.checkPassword(this.get('password'));
          var email = yield this.checkEmail(this.get('email'))
          if( email || password ) {
               throw  _.flatten([email, password]);
          }
          yield next;
     }

     * checkPassword(password) {
          return (password.length < 5) ? { message: 'This Password is too short bruh' } : false;
     }

     * checkEmail(email) {
          var exists = yield User.findOne({ email: this.get('email') });
          return (exists) ? { message: 'This Email Address is already in Use!' } : false;
     }    

}

module.exports = User;
