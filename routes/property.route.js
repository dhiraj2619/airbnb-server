const express = require('express');
const propertyRouter = express.Router();
const upload = require('../config/multerConfig');
const { addProperty } = require('../controllers/property.controller');
const isRoleHost = require('../middlewares/isHostuser');

propertyRouter.post('/add',isRoleHost,upload.fields([
    {name:'images',maxCount:5}
]),addProperty);

module.exports = propertyRouter;