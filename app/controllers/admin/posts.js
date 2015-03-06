
var  Post = require('../../models/post'),
     User = require('../../models/user');
/*
|--------------------------------------------------------------------------
| Posts Controller
| Example Resource
|--------------------------------------------------------------------------
*/

exports.index = function *(){
     var posts = yield Post.all();
     yield this.render('admin/posts/index.liquid', { posts : posts });
};

exports.new = function *(){
     yield this.render('admin/posts/new.liquid');
};

exports.create = function *(){
     var params = this.request.body;
     var post = new Post({
          user: this.session.passport.user,
          title: params.title,
          body: params.body,
          published: params.published
     });
     yield post.save();
     this.redirect('/admin/posts');
};

exports.edit = function *() {
     var post = yield Post.findById(this.params.post);
     yield this.render('admin/posts/edit.liquid', { post: post.toJSON() })
};

exports.update = function *(){
     this.body = 'sdafasdfas';
     // var params = this.request.body;
     // var post = Post();
     // yield post.save();
     // this.redirect('/admin/posts');
};

exports.destroy = function *(){
     this.body = 'destroy post ' + this.params.post;
};