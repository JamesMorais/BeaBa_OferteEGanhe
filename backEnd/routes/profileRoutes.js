const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
    res.send('Rota perfis ativa');
});

router.get('/profiles', authenticateToken, ProfileController.getProfiles);


router.get('/profiles/:id_perfil', authenticateToken, ProfileController.getProfile);


router.post('/register/profile', authenticateToken, ProfileController.registerProfile);


router.put('/edit/profile/:id_perfil', authenticateToken, ProfileController.updateProfile);


router.delete('/delete/:id_perfil', authenticateToken, ProfileController.deleteProfile);

module.exports = router;
