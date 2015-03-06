
/*
|--------------------------------------------------------------------------
| Route Dependencies
|--------------------------------------------------------------------------
*/

var  Resource       = require('koa-resource-router'),
     Root           = require('./controllers/root'),
     Auth           = require('./controllers/auth'),
     Signup         = require('./controllers/signup'),
     Posts          = require('./controllers/admin/posts'),
     mount          = require('koa-mount');


module.exports = function(app) {

     /*
     |--------------------------------------------------------------------------
     | Root
     |--------------------------------------------------------------------------
     */

     app.get('/', Root.getIndex);


     /*
     |--------------------------------------------------------------------------
     | Resources
     |--------------------------------------------------------------------------
     */

     var posts = new Resource('posts', Auth.isAuthed, Posts);

     app.use(mount('/admin', posts.middleware()));


     /*
     |--------------------------------------------------------------------------
     | Signup
     |--------------------------------------------------------------------------
     */

     app.get('/signup', Signup.getIndex);
     app.post('/signup', Signup.postIndex);


     /*
     |--------------------------------------------------------------------------
     | Authentication
     |--------------------------------------------------------------------------
     */

     app.get('/login', Auth.local);
     app.post('/login', Auth.login);

     app.get('/logout', Auth.logout);

     app.get('/forgotten', Auth.forgottenIndex);
     app.post('/forgotten', Auth.forgottenPost);
     
     app.get('/forgotten/reset/:token', Auth.forgottenResetIndex);
     app.post('/forgotten/reset/:token', Auth.forgottenReset);

     app.get('/admin', function *() {
          this.redirect('/admin/posts')
     });

}