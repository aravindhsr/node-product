const express = require('express');
const router = express.Router();
const async = require('async');
const Product = require('../models/Product.js');
const Category = require('../models/Category.js');
const mongoose = require('mongoose');

// function to find the category
var getCategory = async function(inputData) {
    try {
    	// validate inputData
    	if(!inputData || !inputData.name){
    		throw {message: "unable to find category without input"}
    	}
        var category = await Category.find(inputData).exec();
        return category;
    } catch (err) {
        return 'error occured';
    }
}

router.post('/create', async function(req, res) {
    try{

    	// Validate request
        if(!req.body.name) {
            return res.status(400).send({
                message: "Product name can not be empty"
            });
        }
        if(!req.body.catName) {
            return res.status(400).send({
                message: "Category name can not be empty"
            });
        }
        var catFindQuery = {};
        catFindQuery.name = req.body.catName;
        catFindQuery.status = 'Active';
        if(!catFindQuery || !catFindQuery.name){
            throw {message: "unable to find category without input"}
        }
        var dbCategoryData = await getCategory(catFindQuery);
        console.log("dbCategoryData is", dbCategoryData);    
        // check whether any product exists in the same name
        if(dbCategoryData.length == 0){
        	return res.status(400).send({
                message: "No category found in this name"
            });
        }

        // form create data
        var prodCreateData = {
            name: req.body.name,
            categories: [dbCategoryData[0].id],
            description: req.body.description
        }
        console.log("prodCreateData is", prodCreateData);

        // Create a product
        const ProductData = new Product(prodCreateData);

        // save product in DB
        let createdProduct = await ProductData.save();
        console.log("createdProduct is", createdProduct);
        var newCatData = {};
        newCatData.products = dbCategoryData[0].products;
        newCatData.products.push(createdProduct.id);
        var updatedCategoryData = await Category.updateOne({ _id: dbCategoryData[0].id }, newCatData);
        console.log("updatedCategoryData is", updatedCategoryData);
        return res.send(createdProduct);
    } catch(err){
        return res.status(400).send(err);
    }

})

var getIndividualProduct = async function(inputData) {
    try{
        // validate inputData
        if(!inputData || !inputData.name){
            throw {message: "unable to find product without input"}
        }
        // here using await to find the product info
        var product = await Product.find(inputData).populate('categories').exec();
        console.log("product is", product);
        return product;
    } catch(err){
        throw err;
    }
}

router.get('/fetchIndividualProduct', async function(req, res) {
    try{
        if(!req.query.name) {
            return res.status(400).send({
                message: "product name can not be empty"
            });
        }
        var prodFindQuery = {};
        prodFindQuery.name = req.query.name;
        prodFindQuery.status = 'Active';

        var dbProductData = await getIndividualProduct(prodFindQuery);
        console.log("dbProductData is", dbProductData);

        // check whether any product exists in the same name
        if(dbProductData.length == 0){
            return res.status(400).send({
                message: "No product found in this name"
            });
        }

        return res.status(200).send(dbProductData);
    } catch(err){
        return res.status(400).send(err);
    }
})

module.exports = router;

