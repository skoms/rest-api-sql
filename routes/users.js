const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/async-handler');

router.get('/', asyncHandler(async (req, res) => {

}));

module.exports = router;