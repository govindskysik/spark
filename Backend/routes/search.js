const express = require('express');
const router = express.Router();    

const {idSearch,fuzzySearch,cateogorySearch}=require('../controllers/search')

router.get(':id',idSearch);
router.get('/fuzzy',fuzzySearch);   
router.get('/category',cateogorySearch);

module.exports = router;