const blog = require('../../app/controllers/blog.server.controller');
const passport = require('passport');

module.exports = function(app) {
  app
    .route('/blog')
    .get(blog.getPosts)
    .post(blog.postPost);
  app.route('/post/:id').get(blog.getPost);
};
