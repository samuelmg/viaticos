const express = require('express');
const revisar_solicitud_comisionCtl = require('../controllers/revisar_solicitud_comision');

const router = express.Router();
const auth = require('../middlewares/credentials');

router.get('/', auth('J', 'A'), revisar_solicitud_comisionCtl.consultarSolicitudesComision);
router.put('/', auth('J', 'A'), revisar_solicitud_comisionCtl.modificarComision);
// Rutas extras del controlador como archivos, etc.

module.exports = router;