const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/', (req, res) => {
    res.send('Rota perfis ativa');
});

router.get('/profiles', /*authenticateToken,*/ ProfileController.getProfiles);
router.get('/associated', /*authenticateToken,*/ ProfileController.getAssociatedProfilesUsers);
router.get('/transacoes', ProfileController.getTransacoes);

router.get('/profiles/:id_perfil', /*authenticateToken,*/ ProfileController.getProfile);
router.get('/associated/:matricula', /*authenticateToken,*/ ProfileController.getAssociatedProfilesUsersById)
router.get('/profiles/transacoes/:id_perfil', ProfileController.getTransacoesByid);
router.get("/profiles/details/:id_perfil", ProfileController.getProfileWithTransacoes);



router.post('/register/profile', /*authenticateToken,*/ ProfileController.registerProfile);
router.post('/associate', /*authenticateToken,*/ ProfileController.associateProfileUser );


router.put('/edit/profile/:id_perfil', /*authenticateToken,*/ ProfileController.updateProfile);
router.put('/associated/edit/:matricula', /*authenticateToken,*/ ProfileController.updateProfileAssociated)



router.delete('/delete/:id_perfil', /*authenticateToken,*/ ProfileController.deleteProfile);
router.delete('/delete/associations/:matricula', /*authenticateToken,*/ ProfileController.deleteAssociations)

module.exports = router;
