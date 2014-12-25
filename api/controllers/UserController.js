/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req,res) {
		res.view();
	},

  'create': function(req, res, next) {
    var userObj = {
      name: req.param('name'),
      title: req.param('title'),
      email: req.param('email'),
      password: req.param('password'),
      confirmation: req.param('confirmation')
    };

    User.create(userObj, function userCreated(err, user) {
      if(err) {
        req.session.flash = {
          err: err
        };
        // If Error redirect back to sign-up page
        return res.redirect('/user/new');
      }
      //log user in
      req.session.authenticated = true;
      req.session.User = user;

      // Change status to online
      user.online = true;
      user.save(function(err, user) {
        if(err) return next(err);

        res.redirect('/user/show/'+user.id);
      });
    });
  },

  'show': function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if(err) return next(err);
      if(!user) return next();
      res.view({
        user: user
      });
    })
  },

  'index': function(req, res, next) {
    User.find(function foundUsers(err, users) {
      if(err) return next(err);
      if(!users) return next();
      res.view({
        users: users
      });
    })
  },

  'edit': function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if(err) return next(err);
      if(!user) return next();
      res.view({
        user: user
      });
    })
  },

  'update': function(req, res, next) {
    if(req.session.User.admin) {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email'),
        admin: req.param('admin')[1]==='on' ? true:false
      }
    } else {
      var userObj = {
        name: req.param('name'),
        title: req.param('title'),
        email: req.param('email')
      }
    }
    User.update(req.param('id'),userObj, function userUpdated (err) {
      if(err) {
        return res.redirect('/user/edit/'+req.param('id'));
      }
      res.redirect('/user/show/'+req.param('id'))
    })
  },

  'destroy': function(req, res, next) {
    User.findOne(req.param('id'), function foundUser(err, user) {
      if(err) return next(err);
      if(!user) return next('User does\'t exist.');
      User.destroy(req.param('id'), function userDestroy(err) {
        if(err) return next(err);
      });
      res.redirect('/user');
    })
  },

  // This action works with app.js socket.get('/user/subscribe') to
  // subscribe to the User model classroom and instances of the user
  // model
  'subscribe': function(req, res) {

    // Find all current users in the user model
    User.find(function foundUsers(err, users) {
      if (err) return next(err);

      // subscribe this socket to the User model classroom
      User.subscribe(req.socket);

      // subscribe this socket to the user instance rooms
      User.subscribe(req.socket, users);

      // This will avoid a warning from the socket for trying to render
      // html over the socket.
      res.send(200);
    });
  }

};

