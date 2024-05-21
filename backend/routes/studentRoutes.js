const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);

router.post('/', studentController.createStudent);

router.put('/:id', studentController.updateStudentById);

router.delete('/:id', studentController.deleteStudentById);

module.exports = router;
