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
};

exports.postPost = function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'Please log in first');
    res.redirect(`/signin`);
  }
  //Get post data
  blogPost = {
    blogUser: req.user.username,
    blogTitle: req.body.blogTitle,
    blogContent: req.body.blogContent,
  };
  //Create new blogPost document from Model
  const newPost = new Blog(blogPost);
  //Save post
  newPost.save(err => {
    if (err) {
      const message = getErrorMessage(err);
      req.flash('error', message);
      return res.redirect('/blog');
    }
    return res.redirect('/blog');
  });
};

exports.getPost = function(req, res, next) {
  //Find post and render data
  let param = req.params.id;
  Blog.findOne({ _id: param }, function(error, singlePost) {
    if (error) return getErrorMessage(error);
    res.render('post', {
      title: singlePost.blogTitle,
      messages: req.flash('error'),
      selectedPost: singlePost,
      idParam: param,
    });
  });
};

exports.postComment = function(req, res, next) {
  if (!req.user) {
    req.flash('error', 'Please log in first');
    res.redirect(`/signin`);
  }

  // Get ID and Comment Data
  let param = req.params.id;
  let postedComment = {
    commentUser: req.user.username,
    commentTitle: req.body.commentTitle,
    commentContent: req.body.commentContent,
  };

  if (req.body.commentTitle == '') {
    req.flash('error', 'Please enter a title');
    res.redirect(`/post/${param}#comment-section`);
  } else if (req.body.commentContent == '') {
    req.flash('error', 'Please enter comment text');
    res.redirect(`/post/${param}#comment-section`);
  }

  //Push comment to array
  Blog.findOneAndUpdate(
    { _id: param },
    { $push: { blogComments: postedComment } },
    { upsert: true },
    function(comment) {
      console.log('Comment: ' + comment);
    },
  );

  //Redirect instead of render to prevent doublepost
  res.redirect('/post/' + param);
};
