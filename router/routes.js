const express = require("express");
const router = express.Router();

// Default router gate 
router.get("/", (req,res) => {
    res.send("Welcome to Router World!!")
});

module.exports = router;