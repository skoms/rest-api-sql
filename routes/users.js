const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/async-handler');
const { User } = require('../models');

router.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAll();

  res.status(200).json(users);
}));

router.post('/', asyncHandler(async (req, res) => {
  await User.create(req.body);

  res.status(201).location('/').end();
}));

module.exports = router;