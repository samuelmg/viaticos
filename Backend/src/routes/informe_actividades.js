const express = require('express');
const informe_actividadesCtl = require('../controllers/informe_actividades');
const auth = require('../middlewares/credentials');
const router = express.Router();

router.post('/', auth('P', 'J', 'A', 'S'), informe_actividadesCtl.crearInforme);
router.get('/', auth('P', 'J', 'A', 'S'), informe_actividadesCtl.historialInforme);
router.get('/:id', auth('P', 'J', 'A', 'S', 'F'), informe_actividadesCtl.verInforme);
router.put('/', auth('P', 'J', 'A', 'S'), informe_actividadesCtl.modificarInforme);
router.get('/pdf/:id', auth('P', 'J', 'A', 'S', 'F'), informe_actividadesCtl.pdfInforme);
router.get('/pdf_legacy/:id', auth('P', 'J', 'A', 'S', 'F'), informe_actividadesCtl.pdfInformeLegacy);
// Rutas extras del controlador como archivos, etc.

module.exports = router;