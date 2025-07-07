const express = require("express");
const propertyRouter = express.Router();
const upload = require("../config/multerConfig");
const {
  addProperty,
  getAllProperties,
  getHostProperties,
  updateProperty,
  createInitialProperty,
  createPropertyType,
} = require("../controllers/property.controller");
const isRoleHost = require("../middlewares/isHostuser");
const authenticate = require("../middlewares/authenticate");
const isRoleAdmin = require("../middlewares/isRoleAdmin");

// propertyRouter.post('/add',authenticate,isRoleHost,upload.fields([
//     {name:'images',maxCount:5}
// ]),addProperty);

propertyRouter.post("/add", authenticate, createInitialProperty);

propertyRouter.get("/getAll", getAllProperties);
propertyRouter.get("/hostproperties/:userId", authenticate, getHostProperties);
// propertyRouter.put(
//   "/update/:id",
//   authenticate,
//   isRoleHost,
//   upload.fields([
//     {
//       name: "images",
//       maxCount: 5,
//     },
//   ]),
//   updateProperty
// );


propertyRouter.post("/add-propertyType",isRoleAdmin,createPropertyType);

module.exports = propertyRouter;
