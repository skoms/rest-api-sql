const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/async-handler');
const authenticateLogin = require('../middleware/user-auth');
const { Course, User } = require('../models');

router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll(({
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'], 
    include: [ { model: User, attributes: ['firstName', 'lastName', 'emailAddress'] } ] }));

  res.status(200).json(courses);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, { 
    attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'], 
    include: [ { model: User, attributes: ['firstName', 'lastName', 'emailAddress'] } ] });

  res.status(200).json(course);
}));

router.post('/', authenticateLogin, asyncHandler(async (req, res) => {
  req.body.userId = req.currentUser.id;
  const course = await Course.create(req.body);

  res.location(`/api/courses/${course.id}`).status(201).end();
}));

router.put('/:id', authenticateLogin, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ where: { id: req.params.id } });
  const owner = await User.findOne({ where: { id: course.userId }});

  if (owner.emailAddress === req.currentUser.emailAddress) {
    await Course.update(req.body, { where: { id: req.params.id } });
    res.status(204).end();
  } else {
    res.status(403).end();
  }
}));

router.delete('/:id', authenticateLogin, asyncHandler(async (req, res) => {
  const course = await Course.findOne({ where: { id: req.params.id } });
  const owner = await User.findOne({ where: { id: course.userId }});
  
  if (owner.emailAddress === req.currentUser.emailAddress) {
    await Course.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } else {
    res.status(403).end();
  }
}));

module.exports = router;