const express = require('express');
const paisCtl = require('../controllers/pais');
var app = express();

const router = express.Router();

router.get('/', paisCtl.selectPais);

module.exports = router;