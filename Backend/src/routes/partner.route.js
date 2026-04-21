const express = require("express");
const router = express.Router();

const {
  createPartnerController,
  getPartnersController,
  deletePartnerController,
  updatePartnerDocsController
} = require("../controllers/partner.controller");

router.get("/", getPartnersController);
router.post("/", createPartnerController);
router.delete("/:id", deletePartnerController);
router.patch("/:id/docs", updatePartnerDocsController);

// Also map old paths if any frontends use them:
router.post("/create", createPartnerController);
router.get("/all", getPartnersController);

module.exports = router;
