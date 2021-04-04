const express = require('express');
const router = express.Router();

const usersRoute = require('./users');
const coursesRoute = require('./courses');

router.use('/users', usersRoute);
router.use('/courses', coursesRoute);

router.get('/', (req, res) => {
  res.redirect('/users');
});

module.exports = router;