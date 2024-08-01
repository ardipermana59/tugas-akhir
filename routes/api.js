const express = require('express');
const router = express.Router();

// Admin Controllers
const adminUserController = require('../controllers/admin/admin_user_controller');
const adminKandidatController = require('../controllers/admin/admin_kandidat_controller');
const adminPemilihController = require('../controllers/admin/admin_pemilih_controller');
const adminTestingController = require('../controllers/admin/admin_testing_controller');
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

// Pemilih
router.get('/pemilih/data', adminPemilihController.getData);
router.get('/pemilih/:id', adminPemilihController.getDataById);
router.post('/pemilih/add', adminPemilihController.addData);
router.put('/pemilih/update/:id', adminPemilihController.updateData);
router.delete('/pemilih/delete/:id', adminPemilihController.destroy);


// Testing
router.post('/admin/testing/add-block', adminTestingController.addBlock);
router.post('/admin/testing/read', adminTestingController.readBlocks); 

// Admin Kandidat
router.get('/kandidat/data', adminKandidatController.getData);
router.get('/kandidat/:id', adminKandidatController.getDataById);
router.post('/kandidat/add', adminKandidatController.addData);
router.put('/kandidat/update/:id', adminKandidatController.updateData);
router.delete('/kandidat/delete/:id', adminKandidatController.destroy);

router.get('/suara', reportController.getTemporaryResult);



module.exports = router;
