require("../models/database");
const Category = require("../models/category");
const Recipe = require('../models/recipe')

exports.homepage = async (req, res) => {
  const limitNumber = 4;
  const categories = await Category.find({}).limit(limitNumber)
  const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber)
  const thai = await Recipe.find({ 'category': 'Thai'}).limit(limitNumber)
  const american = await Recipe.find({ 'category': 'American'}).limit(limitNumber)
  const chinese = await Recipe.find({ 'category': 'Chinese'}).limit(limitNumber)

  const food = {latest, american, thai, chinese };
  res.render("index", { title: "Homepage", categories, food });
};

exports.getCategories = async (req, res) => {
  const limitNumber = 20;
  const categories = await Category.find({}).limit(limitNumber)
  res.render("getCategories", { title: "Categories", categories });
};

exports.getCategoriesById = async (req, res) => {

  let categoryId = req.params.id;
  const limitNumber = 20;
  const categoryById = await Recipe.find({'category':categoryId }).limit(limitNumber);
  res.render("getCategories", { title: "Categories",categoryById });
};

exports.exploreRecipe = async (req, res) => {

let recipeId = req.params.id;
const recipe = await Recipe.findById(recipeId)

  res.render("exploreRecipe", { title: "Recipe", recipe });
};


exports.searchRecipe = async (req, res) => {
  let searchTerm = req.body.searchTerm;
  let recipe = await Recipe.find({ $text: {$search: searchTerm, $diacriticSensitive: true}});
  res.render("search", { title: "Search",recipe});
};

exports.exploreLatest = async (req, res) => {
  const limitNumber = 20;
  const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber)
  res.render("exploreLatest", { title: "exploreLatest",recipe});
};
exports.exploreRandom = async (req, res) => {
  let count = await Recipe.find().countDocuments();
  let random = Math.floor(Math.random() * count)
  let recipe = await Recipe.findOne().skip(random).exec();
  res.render("exploreRandom", { title: "exploreRandom",recipe});
};

exports.submitRecipe = async (req, res) => {
  const infoErrorObj = req.flash('infoErrors')
  const infoSubmitObj = req.flash('infoSubmit')
  res.render("submit-recipe", { title: "Submit Recipe",infoErrorObj, infoSubmitObj});
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })
    }
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    await newRecipe.save()
    req.flash('infoSubmit', 'Recipe has been added.') 
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash('infoErrors',error);
      res.redirect('/submit-recipe')
  } 
};


