const express = require('express')
const router = express.Router()
const indexRoutes = require('../controllers/indexController')

router.get('/',indexRoutes.homepage)
router.get('/recipe/:id',indexRoutes.exploreRecipe)
router.get('/categories',indexRoutes.getCategories)
router.get('/categories/:id',indexRoutes.getCategoriesById)
router.post('/search',indexRoutes.searchRecipe)
router.get('/explore-latest',indexRoutes.exploreLatest)
router.get('/explore-random',indexRoutes.exploreRandom)
router.get('/submit-recipe',indexRoutes.submitRecipe)
router.post('/submit-recipe',indexRoutes.submitRecipeOnPost)

module.exports = router;