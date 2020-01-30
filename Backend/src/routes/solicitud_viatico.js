const express = require('express');
const solicitud_viaticoCtl = require('../controllers/solicitud_viatico');
const oauth = require('../middlewares/credentials');

const router = express.Router();

router.post('/', oauth('P', 'J', 'A', 'S'),solicitud_viaticoCtl.insert);
//router.get('/', solicitud_viaticoCtl.selectAll);
router.get('/:id', oauth('P', 'J', 'A', 'S'),solicitud_viaticoCtl.select);
router.put('/', oauth('P'), solicitud_viaticoCtl.update);
//router.delete('/', solicitud_viaticoCtl.delete);

// Rutas extras del controlador como archivos, etc.

module.exports = router;