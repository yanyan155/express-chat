module.exports = function(req, res, next) {

  res.sendHttpError = function(error) {
    res.status(error.status);
    if (req.xhr) {
      return res.json(error);
    } else { 
      return res.render('index', {
        title: 'chat',
        description: `Error ${error.status}, ${error.message}`
      });
    }
  }

  next();
}