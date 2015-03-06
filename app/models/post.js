var Mongorito = require('mongorito'),
    Model     = Mongorito.Model,
    cryptp    = require('crypto'),
    ObjectID  = require('mongodb').ObjectID;


class Post extends Model {

     configure() {
          this.defaults = {
               published: false
          }
          this.before('create', 'setID')
     }

     * setID(next) {
          this.set('user', new ObjectID(this.get('user')))
          yield next;
     }

     * allPosts() {
          var posts = yield Post.all();
          var arr = [];
          posts.forEach(function(post) {
               arr.push(post.toJSON());
          });
          return posts;
     }

}

module.exports = Post;