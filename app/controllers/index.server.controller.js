exports.render = function(req, res) {
  let fullName = '';
  if (req.user) {
    fullName = req.user.firstName + ' ' + req.user.lastName;
  }
  res.render('index', {
    title: 'Hello World',
    userFullName: req.user ? fullName : '',
  });
};
