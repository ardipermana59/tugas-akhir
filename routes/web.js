const express = require('express')
const router = express.Router()

// Pemilih Controllers
const authController = require('../controllers/auth_controller')
const homeController = require('../controllers/home_controller')
const reportController = require('../controllers/report_controller')
const errorController = require('../controllers/error_controller')

// Admin Controllers
const adminDashboardController = require('../controllers/admin/admin_dashboard_controller')
const adminKandidatController = require('../controllers/admin/admin_kandidat_controller')
const adminPemilihController = require('../controllers/admin/admin_pemilih_controller')
const adminSettingController = require('../controllers/admin/admin_setting_controller')
const adminUserController = require('../controllers/admin/admin_user_controller')
const adminHasilController = require('../controllers/admin/admin_hasil_controller')
const adminTestingController = require('../controllers/admin/admin_testing_controller')

// Middlewares
const { authMiddleware } = require('../middlewares/auth_middleware')
const { adminMiddleware } = require('../middlewares/role_middleware')

router.get('/', authMiddleware, homeController.index)

router.get('/login', authController.loginView)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

router.get('/terima-kasih', (req, res) => {
    res.render('terima-kasih', { layout: false })
})

router.get('/live', reportController.liveReport)

// Admin Route
router.get('/dashboard', authMiddleware, adminMiddleware, adminDashboardController.view)
router.get('/admin', authMiddleware, adminMiddleware, adminUserController.view)
router.get('/admin/kandidat',  adminKandidatController.view)
router.get('/admin/pemilih', authMiddleware, adminMiddleware, adminPemilihController.view)
router.get('/admin/pengaturan', authMiddleware, adminMiddleware, adminSettingController.view)
router.get('/admin/hasil',  adminHasilController.view)
router.post('/admin/hasil',  adminHasilController.generateHasil)

// Testing
router.get('/admin/testing', authMiddleware, adminMiddleware, adminTestingController.view)

// Error Routes
router.get('/errors/403', errorController.forbidden_403)

module.exports = router 
