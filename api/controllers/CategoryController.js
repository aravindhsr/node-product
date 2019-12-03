const express = require('express');
const router = express.Router();
const async = require('async');
const Category = require('../models/Category.js');

// function to find the category
var getCategory = async function(inputData) {
	try{
		// validate inputData
		if(!inputData || !inputData.name){
			throw {message: "unable to find category without input"}
		}
		// here using await to find the category info
		var category = await Category.find(inputData).exec();
		console.log("category is", category);
	    return category;
	} catch(err){
		throw err;
	}
}

// get unique category info
var getUniqCategoryWithProducts = async function(inputData) {
	try{
		// validate inputData
		if(!inputData || !inputData.name){
			throw {message: "unable to find category without input"}
		}
		// here using await to find the category info
		var category = await Category.find(inputData).populate('products', null, {status: 'Active'}).exec(); // we can use populate to get products attached to the category, first parameter is the field to populate, second is fetching the required field and third one is query
		console.log("category is", category);
	    return category;
	} catch(err){
		throw err;
	}
}

// get all category info
var getAllCategoryWithProducts = async function(inputData) {
	try{
		// validate inputData
		if(!inputData){
			throw {message: "unable to find category without input"}
		}
		// here using await to find the category info
		var category = await Category.find(inputData).populate('products', null, {status: 'Active'}).exec(); // we can use populate to get products attached to the category, first parameter is the field to populate, second is fetching the required field and third one is query
		console.log("category is", category);
	    return category;
	} catch(err){
		throw err;
	}
}

router.post('/create', async function(req, res) {
	try{
		// Validate request
	    if(!req.body.name) {
	        return res.status(400).send({
	            message: "Category name can not be empty"
	        });
	    }
	    var catFindQuery = {};
	    catFindQuery.name = req.body.name;
	    catFindQuery.status = 'Active';

	    var dbCategoryData = await getCategory(catFindQuery);
	    console.log("dbCategoryData is", dbCategoryData);

	    // check whether any category exists in the same name
	    if(dbCategoryData.length > 0){
	    	return res.status(400).send({
	            message: "This Category name already exists"
	        });
	    }

	    // form create data
	    var catCreateData = {
	        name: req.body.name,
	        description: req.body.description
	    }
	    console.log("catCreateData is", catCreateData);

	    // Create a category
	    const categoryData = new Category(catCreateData);

	    // save category in DB
	    let createdCategory = await categoryData.save();
	    res.send(createdCategory);
	} catch(err){
		return res.status(400).send(err);
	}
})

router.get('/fetchIndividualCategory', async function(req, res) {
	try{
		console.log("req.query is", req.query);
		if(!req.query.name) {
	        return res.status(400).send({
	            message: "Category name can not be empty"
	        });
	    }
	    var catFindQuery = {};
	    catFindQuery.name = req.query.name;
	    catFindQuery.status = 'Active';

	    var dbCategoryData = await getUniqCategoryWithProducts(catFindQuery);
	    console.log("dbCategoryData is", dbCategoryData);

	    // check whether any category exists in the same name
	    if(dbCategoryData.length == 0){
	    	return res.status(400).send({
	            message: "No Category found in this name"
	        });
	    }
	    return res.status(200).send(dbCategoryData);
	} catch(err){
		return res.status(400).send(err);
	}
})

router.get('/fetchAllCategory', async function(req, res) {
	try{
	    var catFindQuery = {};
	    catFindQuery.status = 'Active';

	    var dbCategoryData = await getAllCategoryWithProducts(catFindQuery);
	    console.log("dbCategoryData is", dbCategoryData);

	    // check whether any category exists in the same name
	    if(dbCategoryData.length == 0){
	    	return res.status(400).send({
	            message: "No Category found"
	        });
	    }
	    var responseData = [];
	    for(var eachCategory of dbCategoryData){
	    	var categObj = {};
	    	categObj.name = eachCategory.name;
	    	categObj.product_count = eachCategory.products.length;
	    	responseData.push(categObj);
	    }
	    return res.status(200).send(responseData);
	} catch(err){
		return res.status(400).send(err);
	}
})

module.exports = router;
