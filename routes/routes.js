const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" +file.originalname);
    },
});

var uploads = multer({
    storage: storage,
}).single("image");

router.get("/", (req, res) => {
    res.render("index", { title: "Home page "});
});
router.get("/add", (req, res) => {
    res.render("add_product", { title: "Add product "});
});

module.exports = router;