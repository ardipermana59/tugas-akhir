const express = require('express');
const router = express.Router();

// Admin Controllers
const adminUserController = require('../controllers/admin/admin_controller');
const adminKandidatController = require('../controllers/admin/admin_kandidat_controller');
const adminPemilihController = require('../controllers/admin/admin_pemilih_controller');
const adminTestingController = require('../controllers/admin/testing_controller');
const reportController = require('../controllers/report_controller');

// Controllers
const voteController = require('../controllers/vote_controller');

const { authMiddleware } = require('../middlewares/auth_middleware');
const { adminMiddleware } = require('../middlewares/role_middleware');

// Pemilih
router.post('/vote', voteController.vote);

// router.use(authMiddleware);
// router.use(adminMiddleware);

// Admin 
router.get('/admin/data', adminUserController.getData);
router.get('/admin/:id', adminUserController.getAdminById);
router.post('/admin/add', adminUserController.addAdmin);
router.put('/admin/update/:id', adminUserController.updateAdmin);
router.delete('/admin/delete/:id', adminUserController.destroy);

// Testing
router.post('/admin/testing/add-block', adminTestingController.addBlock);
router.post('/admin/testing/read', adminTestingController.readBlocks); 

// Admin Kandidat
router.get('/kandidat/data', adminKandidatController.getData);

// Admin Pemilih
router.get('/pemilih/data', adminPemilihController.getData);

router.get('/suara', reportController.getTemporaryResult);



module.exports = router;
