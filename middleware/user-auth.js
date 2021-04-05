const { User } = require('../models');
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
  const userLogin = auth(req);
  let authenticated = false;

  if (userLogin) {
    const user = await User.findOne({ where: { emailAddress: userLogin.name.toLowerCase() } }); 
    // set userLogin.name(email) to lowercase to make the login username/email case insensitive, like most logins are
    if (user) {
      authenticated = bcrypt
        .compareSync(userLogin.pass, user.password);
      if (authenticated) {
        // Store the user on the Request object
        req.currentUser = user;
      }
    }
  }

  if (!authenticated) {
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};