const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/async-handler');
const { Course, User } = require('../models');

router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({ include: [ { model: User } ] });

  res.status(200).json(courses);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, { include: [ { model: User } ] });

  res.status(200).json(course);
}));

router.post('/', asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);

  res.status(201).location(`/${course.id}`).end();
}));

router.put('/:id', asyncHandler(async (req, res) => {
  await Course.update(req.body, { where: { id: req.params.id } });

  res.status(204).end();
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  await Course.destroy({ where: { id: req.params.id } });

  res.status(204).end();
}));

module.exports = router;