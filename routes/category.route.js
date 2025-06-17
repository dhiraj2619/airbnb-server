const express = require('express');
const { addCategory, getAllCategories } = require('../controllers/category.controller');
const upload = require('../config/multerConfig');
const authenticate = require('../middlewares/authenticate');
const isRoleAdmin = require('../middlewares/isRoleAdmin');
const categoryRouter = express.Router();

categoryRouter.post('/add',authenticate,isRoleAdmin,upload.fields([{
    name: 'thumbnail',
    maxCount: 1
}]), addCategory);

categoryRouter.get('/getAll',getAllCategories)

module.exports = categoryRouter;