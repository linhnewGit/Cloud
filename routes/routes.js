const express = require("express");
const router = express.Router();
const Product = require("../models/products");
const multer = require("multer");
const products = require("../models/products");
const fs = require("fs");

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

router.get("/edit/:id", (req, res) =>{
    let id = req.params.id;
    Product.findById(id, (err, product)=>{
        if (err){
            res.redirect("/");
        } else{
            if (product == null){
                res.redirect("/");
            } else {
                res.render("edit_product", {
                    title: "Update product",
                    product: product,
                });
            }
        }
    });
});

router.post("/update/:id", upload, (req, res)=>{
    let id = req.params.id;
    let new_image = "";
    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch(err){
            console.log(err);
        }
    } else{
        new_image = req.body.old_image;
    }
    Product.findByIdAndUpdate(id, {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        image: new_image,
    }, (err, result)=>{
        if(err){
            res.json({ message: err.message, type: "danger"});
        } else{
            req.session.message = {
                type: "success",
                message: "Product updated!",
            };
            res.redirect("/");
        }
    });
});

router.get("/delete/:id", (req, res)=>{
    let id = req.params.id;
    Product.findByIdAndRemove(id, (err, result)=>{
        if(result.image != ""){
            try{
                fs.unlinkSync("./uploads/" + result.image);
            } catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({ message: err.message });
        } else{
            req.session.message = {
                type: "info",
                message: "Product deleted!",
            };
            res.redirect("/");
        }
    });
});

module.exports = router;