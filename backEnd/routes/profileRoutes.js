const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
    res.send('Rota perfis ativa');
});

router.get('/profiles', /*authenticateToken,*/ ProfileController.getProfiles);
router.get('/associated', ProfileController.getAssociatedProfilesUsers);


router.get('/profiles/:id_perfil', /*authenticateToken,*/ ProfileController.getProfile);
router.get('/associated/:matricula', ProfileController.getAssociatedProfilesUsersById)


router.post('/register/profile', /*authenticateToken,*/ ProfileController.registerProfile);
router.post('/associate', ProfileController.associateProfileUser );


router.put('/edit/profile/:id_perfil', /*authenticateToken,*/ ProfileController.updateProfile);
router.put('/associated/edit/:matricula', ProfileController.updateProfileAssociated)


router.delete('/delete/:id_perfil', /*authenticateToken,*/ ProfileController.deleteProfile);
router.delete('/delete/associations/:matricula', ProfileController.deleteAssociations)

module.exports = router;
