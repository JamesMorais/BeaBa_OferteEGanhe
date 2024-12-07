const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/users', /*authenticateToken,*/ UserController.getAllUsers);
router.get('/users/:matricula', /*authenticateToken,*/ UserController.getUserById);
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.put('/edit/:matricula', /*authenticateToken,*/ UserController.updateUser);
router.delete('/delete/:matricula', /*authenticateToken,*/ UserController.deleteUser);

module.exports = router;
