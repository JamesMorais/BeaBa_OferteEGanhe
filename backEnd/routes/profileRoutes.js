const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');

router.get('/', (req, res) => {
    res.send('Rota perfis ativa');
});

router.get('/profiles', ProfileController.getProfiles);


router.get('/profiles/:id_perfil', ProfileController.getProfile);


router.post('/register/profile', ProfileController.registerProfile);


router.put('/edit/profile/:id_perfil', ProfileController.updateProfile);


router.delete('/delete/:id_perfil', ProfileController.deleteProfile);

module.exports = router;
