const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/async-handler');
const authenticateLogin = require('../middleware/user-auth');
const { User } = require('../models');

router.get('/', authenticateLogin, asyncHandler(async (req, res) => {
  const user = await User.findOne({
    attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
    where: { emailAddress: req.currentUser.emailAddress }
  });

  res.status(200).json(user);
}));

router.post('/', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.location('/').status(201).end();
}));

module.exports = router;