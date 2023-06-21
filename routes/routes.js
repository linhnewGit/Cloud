const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const multer = require("multer");
const products = require("../models/products");

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("image");

router.post("/add", upload, (req, res) =>{
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        image: req.file.filename,
    });
    product.save((err) =>{
        if(err){
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Product added!'
            };
            res.redirect("/");
        }
    });
});

router.get("/", (req, res) => {
    Product.find().exec((err, products) => {
        if(err){
            res.json({ message: err.message });
        } else {
            res.render("index",{
                title: "Home page",
                products: products,
            });
        }
    });
});
router.get("/add", (req, res) => {
    res.render("add_product", { title: "Add product "});
});

module.exports = router;