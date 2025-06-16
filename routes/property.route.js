const express = require('express');
const propertyRouter = express.Router();
const upload = require('../config/multerConfig');
const { addProperty, getAllProperties } = require('../controllers/property.controller');
const isRoleHost = require('../middlewares/isHostuser');
const authenticate = require('../middlewares/authenticate');

propertyRouter.post('/add',authenticate,isRoleHost,upload.fields([
    {name:'images',maxCount:5}
]),addProperty);

propertyRouter.get('/getAll',getAllProperties);

module.exports = propertyRouter;