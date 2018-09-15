const express    = require("express");
const authRoutes = express.Router();
const passport   = require("passport");

// User model
const User       = require('../models/user-model');

// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

// Signup
authRoutes.get('/signup', (req, res, next) => {
  res.render('index', {
    errorMessage2: ''
  });
});

authRoutes.post('/signup', (req, res, next) => {

  const {username, password} = req.body;

  if (username === '' || password === '') {
    res.render('index', {
      errorMessage2: 'Enter both username and password to sign up'
    });
    return;
  }

  User.findOne({ username: username }, '_id', (err, existingUser) => {
    if (err) {
      next(err);
      return;
    }

    if (existingUser !== null) {
      res.render('index', {
        errorMessage2: `The username ${username} is already in use`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(password, salt);

    const userSubmission = {
      username,
      password: hashedPass
    };

    const theUser = new User(userSubmission);

    theUser.save((err) => {
      if (err) {
        res.render('index', {
          errorMessage2: 'Something went wrong. Try again later'
        });
        return;
      }
      req.session.currentUser = theUser;
      res.redirect(`/${theUser.username}/dashboard`);
    });
  });
});

// Login
authRoutes.get('/login', (req, res, next) => {
  res.render('index', {
    errorMessage: ''
  });
});

authRoutes.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('index', {
      errorMessage: 'Enter both username and password to log in'
    });
    return;
  }

  User.findOne({ username: username }, (err, theUser) => {
    if (err || theUser === null) {
      res.render('index', {
        errorMessage: `There isn't an account with username ${username}`
      });
      return;
    }

    if (!bcrypt.compareSync(password, theUser.password)) {
      res.render('index', {
        errorMessage: 'Invalid password'
      });
      return;
    }

    req.session.currentUser = theUser;
    res.redirect(`/${theUser.username}/dashboard`);
  });
});

// Logout
authRoutes.get('/logout', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }

    res.redirect('/');
  });
});

authRoutes.post('/edit', (req, res, next) => {
  User.findById(req.session.currentUser._id, (error, user) => {
    if (error) { next(); } 
		else {
    user.username = req.body.username;
    const salt     = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(req.body.password, salt);
    user.password = hashPass;
    }
    user.save((error) => {
      // req.session.currentUser = theUser;
      const username = req.body.username;
      const password = req.body.password;
      if (username === '' || password === '') { 
        res.render('auth/edit', {
          errorMessage: 'Enter both username and password'
        });
        return; } 
      else { res.redirect(`/${username}/dashboard`); }
			});
    });
});

authRoutes.get('/edit', (req, res, next) => {
  const id = req.session.currentUser._id;
  const userName = req.session.currentUser.username;
  const password = req.session.currentUser.password;
  
	User.findById(id, (error, user) => {
		if (error) {
			next(error);
		} else {
			res.render('auth/edit', { password, userName });
		}
	});
});

authRoutes.post('/delete', (req, res, next) => {
  console.log(req.session.currentUser._id)
  User.findByIdAndRemove(req.session.currentUser._id, (error, user) => {
  if (error) {next(error);
  return;} 
  else {res.redirect('/');}
	
});
});

module.exports = authRoutes;