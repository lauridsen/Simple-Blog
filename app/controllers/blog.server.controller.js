const Blog = require('mongoose').model('Blog');
const passport = require('passport');

function getErrorMessage(err) {
  let message = '';

  for (var errName in err.errors) {
    if (err.errors[errName].message) message = err.errors[errName].message;
  }
  return message;
}

exports.getPosts = function(req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title: 'Sign-in Form',
      messages: req.flash('error') || req.flash('info'),
    });
  } else {
    // const allPosts = Blog.find();
    Blog.find({})
      .sort({ blogCreated: 'desc' })
      .exec(function(error, blogposts) {
        res.render('blog', {
          title: 'Blog',
          messages: req.flash('error'),
          posts: blogposts,
        });
      });
  }
};

exports.postPost = function(req, res, next) {
  if (!req.user) {
    res.render('/ + "error"');
  } else {
    console.log(req.user);
    blogPost = {
      blogUser: req.user.username,
      blogTitle: req.body.blogTitle,
      blogContent: req.body.blogContent,
    };
    console.log('Post object:' + JSON.stringify(blogPost));
    const newPost = new Blog(blogPost);
    newPost.save(err => {
      if (err) {
        const message = getErrorMessage(err);
        req.flash('error', message);
        return res.redirect('/blog');
      }
      return res.redirect('/blog');
    });
  }
};

exports.getPost = function(req, res, next) {
  let param = req.params.id;
  Blog.findOne({ _id: param }, function(error, singlePost) {
    if (error) return getErrorMessage(error);
    res.render('post', {
      title: singlePost.blogTitle,
      messages: req.flash('error'),
      selectedPost: singlePost,
    });
  });
};
