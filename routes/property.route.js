const express = require("express");
const propertyRouter = express.Router();
const upload = require("../config/multerConfig");
const {
  getAllProperties,
  getHostProperties,
  createInitialProperty,
  createPropertyType,
  getAllPropertyTypes,
  createPropertyOptions,
  getPropertyTypePrivacyOptions,
  processingPropertiesofUsers,
  updatePropertyLocation,
  updatePropertySteps,
  getPropertyById,
  getPropertyprivacyById,
  createAmenity,
  getAmenitiesListBypropertyType,
} = require("../controllers/property.controller");
const isRoleHost = require("../middlewares/isHostuser");
const authenticate = require("../middlewares/authenticate");
const isRoleAdmin = require("../middlewares/isRoleAdmin");



propertyRouter.post("/add", authenticate, createInitialProperty);

propertyRouter.get("/getAll", getAllProperties);
propertyRouter.get("/hostproperties/:userId", authenticate, getHostProperties);


propertyRouter.post(
  "/add-propertyType",
  authenticate,
  isRoleAdmin,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  createPropertyType
);

propertyRouter.post(
  "/add-privacyTypes",
  authenticate,
  isRoleAdmin,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  createPropertyOptions
);
propertyRouter.get("/alltypes", getAllPropertyTypes);
propertyRouter.get(
  "/privacyoptions/:propertyTypeId",
  getPropertyTypePrivacyOptions
);
propertyRouter.get(
  "/processingproperties/:userId",
  processingPropertiesofUsers
);
propertyRouter.put(
  "/location/:propertyId",
  authenticate,
  updatePropertyLocation
);
propertyRouter.put("/:propertyId/step", authenticate, updatePropertySteps);
propertyRouter.get("/:propertyId", authenticate, getPropertyById);
propertyRouter.get("/privacytype/:privacyoptionId", authenticate, getPropertyprivacyById);
propertyRouter.post("/add-ameneties",authenticate,isRoleAdmin, upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),createAmenity);
  
  propertyRouter.get('/amenities/:propertyTypeId',authenticate,getAmenitiesListBypropertyType);


module.exports = propertyRouter;
