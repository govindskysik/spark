const express = require('express');
const router = express.Router();    

const {idSearch,fuzzySearch,cateogorySearch}=require('../controllers/search')

router.get('/id/:id',idSearch);
router.get('/fuzzy',fuzzySearch);   
router.get('/category/:category',cateogorySearch);

module.exports = router;