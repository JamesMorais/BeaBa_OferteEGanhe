const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/users', UserController.getAllUsers);
router.get('/users/:matricula', UserController.getUserById);
router.post('/register', UserController.registerUser);
router.put('/edit/:matricula', UserController.updateUser);
router.delete('/delete/:matricula', UserController.deleteUser);

module.exports = router;
