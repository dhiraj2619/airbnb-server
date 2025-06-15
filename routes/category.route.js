const express = require('express');
const { addCategory } = require('../controllers/category.controller');
const upload = require('../config/multerConfig');
const categoryRouter = express.Router();

categoryRouter.post('/add',upload.fields([{
    name: 'thumbnail',
    maxCount: 1
}]), addCategory);

module.exports = categoryRouter;