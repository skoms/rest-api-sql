const express = require('express');
const router = express.Router();

const usersRoute = require('./users');
const coursesRoute = require('./courses');

router.get('/', (req, res) => {

});

router.use('/users', usersRoute);
router.use('/courses', coursesRoute);

module.exports = router;