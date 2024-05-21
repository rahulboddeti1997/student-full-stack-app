const Student = require('../models/Student');
const { Op } = require('sequelize');


exports.getAllStudents = async (req, res) => {
    try {
        const { pageNo, pageSize, grade, name, ageMin, ageMax } = req.query;
        const page = parseInt(pageNo) || 1;
        const limit = parseInt(pageSize) || 10;
        const offset = (page - 1) * limit;
        
        const whereClause = {};
        if (grade) {
            whereClause.grade = grade;
        }
        if (name) {
            whereClause.name = { [Op.like]: `%${name}%` };
        }    
        if (ageMin && ageMax) {
            whereClause.age = { [Op.between]: [parseInt(ageMin), parseInt(ageMax)] };
        } else if (ageMin) {
            whereClause.age = { [Op.gte]: parseInt(ageMin) };
        } else if (ageMax) {
            whereClause.age = { [Op.lte]: parseInt(ageMax) };
        }
        
        const students = await Student.findAll({
            where: whereClause,
            limit: limit,
            offset: offset
        });
        
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createStudent = async (req, res) => {
    const { name, age, grade } = req.body;
    try {
        const newStudent = await Student.create({ name, age, grade });
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.updateStudentById = async (req, res) => {
    const { name, age, grade } = req.body;
    try {
        const [numOfAffectedRows, updatedStudent] = await Student.update(
            { name, age, grade },
            { where: { id: req.params.id }, returning: true }
        );
        if (numOfAffectedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(updatedStudent[0]); // updatedStudent is an array of updated rows, we take the first one
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteStudentById = async (req, res) => {
    try {
        const numOfDeletedRows = await Student.destroy({ where: { id: req.params.id } });
        if (numOfDeletedRows === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

