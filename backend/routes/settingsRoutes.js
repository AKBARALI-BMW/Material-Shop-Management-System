const express = require("express");
const router = express.Router();
const {getSettings, saveSettings, upload } = require("../controllers/settingsController");
const {protect} = require("../middleware/authMiddleware");



router.get("/", protect, getSettings);
router.post("/", protect, upload.single('logo'), saveSettings);

module.exports = router;