/**
 * Created by dark0s on 22/12/14.
 */

module.exports = function(req, res, ok) {
  var sessionUserMatchsId = req.session.User ? req.session.User.id:false === req.param('id');
  var isAdmin = req.session.User? req.session.User.admin : false;

  if(!(sessionUserMatchsId || isAdmin)) {
    var noRightError = [{name: 'noRights', message:'You must be an admin'}];
    req.session.flash = {
      err: noRightError
    };
    res.redirect('/session/new');
    return;
  }
  ok();
};
