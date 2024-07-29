const express = require('express');
const router = express.Router();
const cron = require('node-cron');

// Controllers
const authController = require('../controllers/auth_controller');
const homeController = require('../controllers/home_controller');
const voteController = require('../controllers/vote_controller');
const reportController = require('../controllers/report_controller');
const errorController = require('../controllers/error_controller');

// Admin Controller 
const adminDashboardController = require('../controllers/admin/admin_dashboard_controller');
const adminKandidatController = require('../controllers/admin/admin_kandidat_controller');
const adminPemilihController = require('../controllers/admin/admin_pemilih_controller');
const adminSettingController = require('../controllers/admin/admin_setting_controller');
const adminUserController = require('../controllers/admin/admin_controller');
const adminTestingController = require('../controllers/admin/testing_controller');

// Middlewares
const { authMiddleware } = require('../middlewares/auth_middleware');
const { adminMiddleware } = require('../middlewares/role_middleware');

router.get('/', authMiddleware, homeController.index);

router.get('/login', authController.loginView);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.get('/terima-kasih', (req, res) => {
    res.render('terima-kasih', { layout: false })
});

router.get('/live', reportController.liveReport);

// Admin Route
// authMiddleware, adminMiddleware
router.get('/dashboard', adminDashboardController.view);
router.get('/admin', adminUserController.view);
router.get('/admin/kandidat', adminKandidatController.view);
router.get('/admin/pemilih', adminPemilihController.view);
router.get('/admin/pengaturan', adminSettingController.view); 

// Testing
router.get('/admin/testing', adminTestingController.view); 

// Error Routes
router.get('/errors/403', errorController.forbidden_403);

cron.schedule('0 */5 * * *', () => {
    console.log('Menjalankan fungsi suara setiap 5 jam');
    reportController.suara();
});
module.exports = router; 
