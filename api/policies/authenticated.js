/**
 * Created by dark0s on 21/12/14.
 */
module.exports = function(req, res, ok) {
  if(req.session.authenticated) {
    return ok();
  }
  else {
    var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in.'}];
    req.session.flash = {
      err: requireLoginError
    };
    res.redirect('/session/new');
    return;
  }
}
