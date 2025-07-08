const express = require('express');
const router = express.Router();    

const {idSearch,fuzzySearch,cateogorySearch,getAllCategories}=require('../controllers/search')

router.get('/id/:id',idSearch);
router.get('/fuzzy',fuzzySearch);   
router.get('/category/:category',cateogorySearch);
router.get('/fetchCategories',getAllCategories)

module.exports = router;