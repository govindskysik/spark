const express = require('express');
const router = express.Router();

const searchRouter = require('./search');
const cartRouter = require('./cart');
const transcribeRouter = require('./transcribe');
const ttsRouter = require('./tts');

const auth = require('../middleware/auth');

router.use('/search', searchRouter);
router.use('/cart', auth, cartRouter);
router.use('/transcribe', transcribeRouter);

router.use('/tts', ttsRouter);

module.exports = router;
