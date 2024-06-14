const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/auth_controller');
const homeController = require('../controllers/home_controller');
const voteController = require('../controllers/vote_controller');
const reportController = require('../controllers/report_controller');

// Middlewares
const { authMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, homeController.index);

router.get('/login', authController.loginView);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/terima-kasih', (req,res) => {
    res.render('terima-kasih')
});
router.get('/live',  reportController.liveReport);

module.exports = router;
